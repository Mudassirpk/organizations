import { ACTION } from '@prisma/client';

export type TActionRequestMeta = {
  actionAttributes: ACTION[];
  action?: {
    type: ACTION;
    resource: number; // resourceId
  };
  organization: number; // organizationId
};
