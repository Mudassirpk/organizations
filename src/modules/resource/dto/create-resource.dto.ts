import { ApiProperty } from '@nestjs/swagger';
import { ATTRIBUTE_TYPE } from '@prisma/client';

export class CreateResourceDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  organizationId: number;
  attributes: TAttribute[];
}

export type TAttribute = {
  name: string;
  type: ATTRIBUTE_TYPE;
  relationId?: number; // id of resource to relate
};
