import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceItemDTO {
  @ApiProperty()
  values: { name: string; value: string }[];

  @ApiProperty()
  resource: number;
}
