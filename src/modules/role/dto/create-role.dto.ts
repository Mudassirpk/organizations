import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  organizationId: number;
  @ApiProperty()
  roleName: string;
}
