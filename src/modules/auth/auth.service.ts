import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { LoginDTO } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(input: LoginDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: input.email,
          user_organization: {
            some: {
              organization: {
                userOrgId: input.organizationId,
              },
            },
          },
        },
        include: {
          user_organization: {
            include: {
              organization: true,
            },
          },
        },
      });

      const passwordMatched = await bcryptjs.compare(
        input.password,
        user?.password || '',
      );

      if (!user || !passwordMatched)
        return {
          success: false,
          message: 'Invalid email or password',
        };

      const token = jwt.sign(
        { email: user.email, id: user.id },
        this.configService.get('JWT_SECRET'),
      );

      user.password = null;

      return { success: true, user, token };
    } catch (error) {
      console.log(error);
    }
  }
}
