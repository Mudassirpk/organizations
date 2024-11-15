import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  roleId: number;

  // TODO: later remove it as we will get userid from token
  @ApiProperty()
  adminId: number;
}
