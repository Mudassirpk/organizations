import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { TActionRequestMeta } from 'types/request';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(
    context: ExecutionContext,
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      include: {
        permissions: {
          include: {
            permission: {
              include: {
                resource: true,
              },
            },
          },
        },
      },
    });

    const organization = await this.prisma.user_organization.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        role: true,
      },
    });
    // admin can perform any action
    if (organization.role.name === 'ADMIN') return true;

    if (user.permissions.length === 0)
      throw new HttpException('UnAuthorized', 401);

    const meta: TActionRequestMeta = request.body.meta;

    if (
      (!meta.actionAttributes || meta.actionAttributes.length === 0) &&
      (!meta?.action?.type || !meta?.action?.resource || !meta?.organization)
    )
      throw new HttpException(
        'Invalid action request, an action request must specify meta in body as => {action:{type:action_type,resource:resourceId},organization:organizationId}',
        400,
      );

    console.log(user.permissions);

    const higherPermission = user.permissions.find((permission) => {
      console.log(
        permission.permission.resourceActions,
        ' : ',
        meta.actionAttributes,
      );
      return (
        permission.permission.resourceActions &&
        permission.permission.resourceActions.find((rA) =>
          meta.actionAttributes.includes(rA),
        )
      );
    });

    if (higherPermission) return true;

    const action = meta.action.type;
    const resource = meta.action.resource;

    const permission = await this.prisma.user_permission.findFirst({
      where: {
        userId: user.id,
        permission: {
          OR: [
            { organizationId: meta.organization, resourceId: resource, action },
            {
              resourceActions: {
                has: action,
              },
            },
          ],
        },
      },
      include: {
        permission: true,
      },
    });
    console.log(permission);

    if (!permission) throw new HttpException('Unauthorized', 401);

    return false;
  }
}
