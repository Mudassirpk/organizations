import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async get() {
        return await this.prisma.user.findFirst({
            include: {
                permissions: true,
                role: true,
                user_organization: {
                    select: {
                        organization: true
                    }
                }
            }
        })
    }

}
