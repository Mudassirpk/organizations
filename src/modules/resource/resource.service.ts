import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { UpdateResourceDTO } from './dto/update.dto';
import { AddAttributeDTO } from './dto/add-attribute.dto';
import { CreateResourceItemDTO } from './dto/create-resource-item.dto';
import { UpdateAttributeDTO } from './dto/update-attribute.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

  async create_resource_item(input: CreateResourceItemDTO) {
    try {
      const data = {};

      for (const value of input.values) {
        data[value.name] = value.value;
      }

      const item = await this.prisma.resource_atom.create({
        data: {
          data: data,
          resourceId: input.resource,
        },
      });

      return item;
    } catch (error) {
      console.log(error);
    }
  }

  async create(createDTO: CreateResourceDTO) {
    try {
      const resource = await this.prisma.resource.create({
        data: {
          name: createDTO.name,
          organization: { connect: { id: createDTO.organizationId } },
          attributes: {
            createMany: {
              data: createDTO.attributes.map((attribute) => {
                return {
                  name: attribute.name,
                };
              }),
            },
          },
        },
        include: {
          attributes: true,
        },
      });

      return {
        message: 'Resource created successfully',
        resource,
        success: true,
      };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        return {
          success: false,
          message: `resource with same ${error.meta.target[0] === 'organizationId' ? 'name' : error.meta.target[0]} already exists`,
        };
      }
      return {
        success: false,
        error,
      };
    }
  }

  async getById(id: number) {
    return await this.prisma.resource.findUnique({
      where: { id },
      include: {
        resource_atom: true,
        attributes:true
      },
    });
  }

  async update(updateDto: UpdateResourceDTO) {
    try {
      const updated = [];
      for (const attribute of updateDto.attributes) {
        updated.push(
          await this.prisma.attribute.update({
            where: {
              id: attribute.id,
              resourceId: updateDto.resourceId,
            },
            data: {
              name: attribute.value,
            },
          }),
        );
      }
      return { success: true, updated };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  async addAttribute(input: AddAttributeDTO) {
    try {
      const addedAttribute = await this.prisma.attribute.create({
        data: {
          resourceId: input.resourceId,
          name: input.name,
        },
      });

      // add default value to all other created resource_atoms for this resource
      await this.prisma.$executeRaw`
          UPDATE "resource_atom"
          SET "data" = "data"::jsonb || jsonb_build_object(${input.name}, ${input.defaultValue || ''})
          WHERE "resourceId" = ${input.resourceId}
      `;

      return { success: true, attribute: addedAttribute };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  async updateAttribute(input: UpdateAttributeDTO) {
    try {
      const atom = await this.prisma.resource_atom.findUnique({
        where: { id: input.atomId },
      });

      if (atom) {
        const data = atom.data;
        data[input.name] = input.value;

        await this.prisma.resource_atom.update({
          where: {
            id: atom.id,
            resourceId: atom.resourceId,
          },
          data: {
            data: data,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getByOrganization(organizationId: number) {
    return await this.prisma.resource.findMany({
      where: {
        organizationId,
      },
      include: {
        attributes: true,
        resource_atom: true,
      },
    });
  }
}
