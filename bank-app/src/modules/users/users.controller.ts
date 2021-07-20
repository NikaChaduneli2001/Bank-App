import { Body, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { find } from 'rxjs';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { usersInterface } from 'src/interface/users.interface';
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
  // For user
  @Get('/:personalNumber')
  async findUserByPersonalNumber(@Req() req) {
    try {
      const { user } = req;
      const finduser = await this.usersService.getUserByPersonalNumber(
        user.personalNumber,
      );
      if (!finduser) {
        return getErrorMessage('user not found');
      } else {
        return getSuccessMessage(finduser);
      }
    } catch {
      return getErrorMessage('Could Not Find User');
    }
  }
  // FOR MANAGER
  @Get()
  async getUser(data: getAllUsersDto) {
    try {
      const findUser = await this.usersService.getAllUser(data);
      if (!findUser) {
        return getErrorMessage('Could Not found user');
      } else {
        return getSuccessMessage(findUser);
      }
    } catch {
      return getErrorMessage('Could Not Find User with given params');
    }
  }
  // For Admin
  @Delete('/:id')
  async deletedUser(@Req() req) {
    try {
      const { user } = req;
      const deleted = await this.usersService.deleteUser(user.id);
      if (!deleted) {
        return getErrorMessage('Could Not deleted user');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch {
      return getErrorMessage('Could Not deleted user with given params');
    }
  }
}
