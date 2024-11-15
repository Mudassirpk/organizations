import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  organizationId: number;
  attributes: TAttribute[];
}

export type TAttribute = {
  name: string;
  value: string;
};
