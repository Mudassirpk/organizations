import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { deleteAtomDTO } from './dto/deleteAtom.dto';

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
}
