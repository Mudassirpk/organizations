import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { deleteAtomDTO } from './dto/deleteAtom.dto';
import { UpdateAtomDTO } from '../resource/dto/update-atom.dto';
import { setAtomData } from '../../shared/utils';

@Injectable()
export class AtomService {
  constructor(private readonly prisma: PrismaService) {}

  async delete(input: deleteAtomDTO) {
    try {
      await this.prisma.resource_atom.delete({
        where: { id: input.atomId },
      });
      return {
        success: true,
        message: `Atom deleted successfully`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Internal server error`,
      };
    }
  }

  async one(atomId: number) {
    return await this.prisma.resource_atom.findUnique({
      where: { id: atomId },
      include: {
        resource: true,
      },
    });
  }

  async update(atomId: number, input: UpdateAtomDTO) {
    try {
      const resource = await this.prisma.resource.findUnique({
        where: { id: input.resourceId },
        include: {
          attributes: true,
        },
      });

      let data = {};

      for (const value of input.values) {
        // if new atom has a key which not defined on attributes of a resource
        if (!resource.attributes.map((a) => a.name).includes(value.name))
          return {
            success: false,
            message: `Invalid key ${value.name}`,
          };

        const relationNames = resource.attributes
          .filter((a) => a.type === 'RESOURCE')
          .map((a) => a.name);

        const relations = resource.attributes.filter(
          (a) => a.type === 'RESOURCE',
        );

        data = { ...data, ...setAtomData(relationNames, relations, value) };
      }

      await this.prisma.resource_atom.update({
        where: { id: atomId },
        data: {
          data,
        },
      });

      return {
        success: true,
        message: 'Atom updated successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  async manyByIds(ids: number[]) {
    return await this.prisma.resource_atom.findMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
