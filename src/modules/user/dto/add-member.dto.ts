import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  roleId: number;
}
