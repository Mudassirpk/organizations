import { RESOURCE } from "@prisma/client"

export class CreatePermissionDto {
    organizationId: number
    actionId: number
    resource: RESOURCE
}
