import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateResourceDTO } from './dto/create-resource.dto';

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) { }

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
}
