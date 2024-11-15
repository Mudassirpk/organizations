import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AddMemberDTO } from './dto/add-member.dto';
import { UserId } from '../../decorators/userId.decorator';
import { AuthGaurd } from '../../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  get() {
    return this.userService.get();
  }

  @Post('member/add')
  @UseGuards(AuthGaurd)
  addMember(@Body() body: AddMemberDTO, @UserId() userId: number) {
    return this.userService.addMember(body, userId);
  }
}
