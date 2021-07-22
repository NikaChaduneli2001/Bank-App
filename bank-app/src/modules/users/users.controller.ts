import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { Role } from 'src/enums/role.enum';
import { usersInterface } from 'src/interface/users.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async registerUser(@Body() data: registerUsersDto) {
    try {
      const user = await this.usersService.registerUser(data);
      if (user) {
        return getSuccessMessage(user);
      }
    } catch {
      return getErrorMessage('Could Not Register User with given params');
    }
  }

  @Get(':personalNumber')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserByPersonalNumber(
    @Param('personalNumber') personalNumber: string,
  ) {
    try {
      const findUser = await this.usersService.getUserByPersonalNumber(
        personalNumber,
      );
      if (!findUser) {
        return getErrorMessage('user not found');
      } else {
        return getSuccessMessage(findUser);
      }
    } catch {
      return getErrorMessage('Could Not Find User');
    }
  }

  @Get('/admin/:personalNumber')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findUserByPersonalNumber(
    @Param('personalNumber') personalNumber: string,
  ) {
    try {
      const user = await this.usersService.findUserByPersonalNumber(
        personalNumber,
      );
      if (!user) {
        return getErrorMessage('Could Not find user');
      } else {
        return getSuccessMessage(user);
      }
    } catch {
      return getErrorMessage('Could Not Find User');
    }
  }
  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(@Query() data: getAllUsersDto) {
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
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedUser(@Param('id') id: number) {
    try {
      const deleted = await this.usersService.deleteUser(Number(id));
      if (!deleted) {
        return getErrorMessage('Could Not deleted user');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch {
      return getErrorMessage('Could Not deleted user with given params');
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(@Param('id') id: number, data: usersInterface) {
    try {
      const updated = await this.usersService.updateUser(id, data);
      if (!updated) {
        return getErrorMessage('Could nor updated user');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage('Could uodated user with given params');
    }
  }
}
