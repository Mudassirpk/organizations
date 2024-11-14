import { ACTION } from '@prisma/client';

export class CreatePermissionDto {
  organizationId: number;
  action: ACTION;
  resource?: number;
  resourceActions?: ACTION[];
}
