import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty()
  user: number;
  @ApiProperty()
  permission: number;
}
