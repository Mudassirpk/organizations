import { ApiProperty } from '@nestjs/swagger';

export class updateAtomDTO {
  @ApiProperty()
  atomdI: number;

  @ApiProperty()
  values: Record<string, string>[];

  /*
  
  [{
    name:v1 as string,
    value:value as string
},{
    name:v1 as string,
    value:value as string[]
    }]
  
  */
}
