import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttributeDTO {
  @ApiProperty()
  resourceId: number;

  @ApiProperty()
  atomId: number;

  @ApiProperty()
  name: string;
  @ApiProperty()
  value: string;
}
