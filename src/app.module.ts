import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { PostModule } from './modules/post/post.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { ResourceModule } from './modules/resource/resource.module';

@Module({
  imports: [UserModule, PostModule, PermissionsModule, AuthModule, RoleModule, ResourceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
