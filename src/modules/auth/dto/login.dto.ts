import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;

  // this is the organization id which was generated at time of user and organization creation different from organization's database id
  @ApiProperty()
  organizationId: string;
}
