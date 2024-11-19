import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceItemDTO {
  @ApiProperty()
  values: {
    name: string;
    value:
      | string // normal value (ALPHANUM) | "all" if all resources are selected for a relation
      | string[]; // only some atoms where selected// all atoms where selected;
  }[];

  @ApiProperty()
  resource: number;
}
