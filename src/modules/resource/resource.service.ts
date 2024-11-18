import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateResourceDTO } from './dto/create-resource.dto';
import { UpdateResourceDTO } from './dto/update.dto';
import { AddAttributeDTO } from './dto/add-attribute.dto';
import { CreateResourceItemDTO } from './dto/create-resource-item.dto';
import { UpdateAttributeDTO } from './dto/update-attribute.dto';

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) { }

  async create_resource_item(input: CreateResourceItemDTO) {
    try {
      const data = {};

      const attributes = (
        await this.prisma.resource.findUnique({
          where: { id: input.resource },
          include: {
            attributes: true,
          },
        })
      ).attributes;

      for (const value of input.values) {

        // if new atom has a key which not defined on attributes of a resource
        if (!attributes.map(a => a.name).includes(value.name)) return {
          success: false,
          message: `Invalid key ${value.name}`
        }

        const relationNames = attributes
          .filter((a) => a.type === 'RESOURCE')
          .map((a) => a.name);

        const relations = attributes.filter((a) => a.type === 'RESOURCE');

        if (
          relationNames.includes(value.name) &&
          relations.find((r) => r.name === value.name).relationType === 'OTM'
        ) {
          // handle addition OTM relation field
          data[value.name] = [value.value];
        } else {
          data[value.name] = value.value;
        }
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
                if (attribute.relationId) {
                  // if the attribute is a relation to another resource
                  return {
                    name: attribute.name,
                    relationId: attribute.relationId,
                  };
                }
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
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        resource_atom: true,
        attributes: true,
      },
    });
    return await this.getResourceWithRelations(resource);
  }

  async update(updateDto: UpdateResourceDTO) {
    try {
      // if name was updated
      if (updateDto.name) {
        await this.prisma.resource.update({
          where: { id: updateDto.resourceId },
          data: {
            name: updateDto.name,
          },
        });
      }

      const updated = [];
      for (const attribute of updateDto.attributes) {
        // updated or deleted attributes
        if (attribute.id) {
          if (attribute.delete) {
            await this.prisma.attribute.delete({
              where: { id: attribute.id },
            });
          } else {
            updated.push(
              await this.prisma.attribute.update({
                where: {
                  id: attribute.id,
                  resourceId: updateDto.resourceId,
                },
                data: {
                  name: attribute.name,
                  type: attribute.type,
                },
              }),
            );
          }
        } else {
          // newly added attributes
          await this.prisma.attribute.create({
            data: {
              resource: {
                connect: {
                  id: updateDto.resourceId,
                },
              },
              name: attribute.name,
              type: attribute.type,
            },
          });
        }
      }
      return {
        success: true,
        updated,
        message: 'Resource updated successfully',
      };
    } catch (error) {
      console.log(error);
      return { success: false, error, message: 'Internal server error' };
    }
  }

  async addAttribute(input: AddAttributeDTO) {
    try {
      const addedAttribute = await this.prisma.attribute.create({
        data: {
          resourceId: input.resourceId,
          name: input.name,
          type: input.type,
          relationId: input.relationId,
          relationType: input.relationType,
        },
      });

      // const resource = await this.prisma.resource.findUnique({ where: { id: input.resourceId } })

      // add default value to all other created resource_atoms for this resource
      // await this.prisma.$executeRaw`
      //     UPDATE "resource_atom"
      //     SET "data" = "data"::jsonb || jsonb_build_object(${input.name}, ${input.defaultValue || ''}) 
      //      ${input.relationId ? ` || jsonb_build_object(${JSON.stringify(resource.name + '_id')}, ${JSON.stringify(input.relationId)})` : `""`}
      //     WHERE "resourceId" = ${input.resourceId}
      // `;

      return { success: true, attribute: addedAttribute };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
  async getResourceWithRelations(resource: any) {
    const relations = resource.attributes.filter((a) => a.type === 'RESOURCE');
    for (const relation of relations) {
      const ras = [];
      for (const ra of resource.resource_atom) {
        ra.data[relation.name] = (await this.prisma.resource.findUnique({
          where: { id: relation.relationId },
          include: { resource_atom: true },
        })).resource_atom.map(ra => { return { id: ra.id, ...(ra.data as any) } });

        ras.push(ra);
      }
    }
    return resource;
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
    const resources = await this.prisma.resource.findMany({
      where: {
        organizationId,
      },
      include: {
        attributes: true,
        resource_atom: true,
      },
    });

    const resourcesWithAtoms = [];

    for (const r of resources) {
      resourcesWithAtoms.push(await this.getResourceWithRelations(r));
    }
    return resourcesWithAtoms;
  }
}
