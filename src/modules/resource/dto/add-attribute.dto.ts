import { ApiProperty } from '@nestjs/swagger';

export class AddAttributeDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  value: string;
  @ApiProperty()
  resourceId: number;
}
