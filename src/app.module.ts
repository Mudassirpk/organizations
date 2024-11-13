import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { PostModule } from './modules/post/post.module';
import { PermissionsModule } from './modules/permissions/permissions.module';

@Module({
  imports: [UserModule, PostModule, PermissionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
