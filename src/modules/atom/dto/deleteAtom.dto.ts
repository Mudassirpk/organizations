import { ApiProperty } from '@nestjs/swagger';

export class deleteAtomDTO {
  @ApiProperty()
  atomId: number;
}
