import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AddMemberDTO } from './dto/add-member.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  get() {
    return this.userService.get();
  }

  @Post('member/add')
  addMember(@Body() body: AddMemberDTO) {
    return this.userService.addMember(body);
  }
}
