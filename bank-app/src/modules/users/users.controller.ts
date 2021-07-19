import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { registerUsersDto } from 'src/dto/register-users.dto';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async registerUser(@Body() data: registerUsersDto) {
    try {
      const user = await this.usersService.registerUser(data);
      if (!user) {
        return getErrorMessage('Could Not Register User With given params');
      } else {
        return getSuccessMessage(user);
      }
    } catch {
      return getErrorMessage('Could Not Register User with given params');
    }
  }
}
