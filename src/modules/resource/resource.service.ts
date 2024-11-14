import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { UpdateResourceDTO } from './dto/update.dto';
import { AddAttributeDTO } from './dto/add-attribute.dto';

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

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
                  value: attribute.value,
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
        resource,
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }

  async update(updateDto: UpdateResourceDTO) {
    try {
      const updated = [];
      for (const attribute of updateDto.attributes) {
        updated.push(
          await this.prisma.resourceAttribute.update({
            where: {
              id: attribute.id,
              resourceId: updateDto.resourceId,
            },
            data: {
              value: attribute.value,
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
      const addedAttribute = await this.prisma.resourceAttribute.create({
        data: {
          resourceId: input.resourceId,
          name: input.name,
          value: input.value,
        },
      });

      return { success: true, attribute: addedAttribute };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  async getByOrganization(organizationId: number) {
    return await this.prisma.resource.findMany({
      where: {
        organizationId,
      },
      include: {
        attributes: true,
      },
    });
  }
}
