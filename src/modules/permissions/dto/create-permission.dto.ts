import { ACTION } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  organizationId: number;
  @ApiProperty()
  action: ACTION;
  @ApiProperty()
  resource?: number;
  @ApiProperty()
  resourceActions?: ACTION[];
}
