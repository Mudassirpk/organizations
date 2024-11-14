import { ACTION } from '@prisma/client';

export type TActionRequsetMeta = {
  action: {
    type: ACTION;
    resource: number; // resourceId
  };
  organization: number; // organizationId
};
