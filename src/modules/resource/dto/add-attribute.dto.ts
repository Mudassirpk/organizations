import { ApiProperty } from '@nestjs/swagger';
import { ATTRIBUTE_TYPE, RELATION_TYPE } from '@prisma/client';

export class AddAttributeDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: ATTRIBUTE_TYPE;
  @ApiProperty()
  resourceId: number;

  @ApiProperty()
  relationId: number;

  @ApiProperty()
  relationType: RELATION_TYPE;

  @ApiProperty()
  defaultValue?: string;
}
