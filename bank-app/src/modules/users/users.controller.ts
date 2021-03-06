import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { find } from 'rxjs';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { Role } from 'src/enums/role.enum';
import { UsersInterface } from 'src/interface/users.interface';
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
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async registerUser(@Body() data: registerUsersDto) {
    this.logger.log(`register user ${JSON.stringify(data)}`);
    try {
      const user = await this.usersService.registerUser(data);
      this.logger.log(`registered user succefully ${JSON.stringify(user)}`);
      if (user) {
        return getSuccessMessage(user);
      }
      this.logger.error(
        `could not register user ${JSON.stringify(
          user,
        )}, data: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      this.logger.error(
        `could not register user with given params: ${JSON.stringify(
          data,
        )} ,error: ${error}`,
      );
      return getErrorMessage('Could Not Register User with given params');
    }
  }

  @Get(':personalNumber')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUserByPersonalNumber(
    @Param('personalNumber') personalNumber: string,
  ) {
    this.logger.log(`users personalNumber: ${JSON.stringify(personalNumber)}`);
    try {
      const findUser = await this.usersService.getUserByPersonalNumber(
        personalNumber,
      );
      this.logger.log(
        `find user with personalNumber: ${JSON.stringify(findUser)}`,
      );
      if (!findUser) {
        this.logger.error(
          `users not found ${JSON.stringify(
            findUser,
          )},personalNumber: ${JSON.stringify(personalNumber)}`,
        );
        return getErrorMessage('user not found');
      } else {
        return getSuccessMessage(findUser);
      }
    } catch (error) {
      this.logger.error(
        `could not find user with personalNumber: ${JSON.stringify(
          personalNumber,
        )},error: ${error}`,
      );
      return getErrorMessage('Could Not Find User');
    }
  }

  @Get('admin/:personalNumber')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findUserByPersonalNumber(
    @Param('personalNumber') personalNumber: string,
  ) {
    this.logger.log(
      `users personalNumber for admins: ${JSON.stringify(personalNumber)}`,
    );
    try {
      const user = await this.usersService.findUserByPersonalNumber(
        personalNumber,
      );
      this.logger.log(`find user by personalNumber: ${JSON.stringify(user)}`);
      if (!user) {
        this.logger.error(
          `users not found ${JSON.stringify(
            user,
          )},personalNumber: ${JSON.stringify(personalNumber)}`,
        );
        return getErrorMessage('Could Not find user');
      } else {
        return getSuccessMessage(user);
      }
    } catch (error) {
      this.logger.error(
        `could not find user with personalNumber: ${JSON.stringify(
          personalNumber,
        )},error: ${error}`,
      );
      return getErrorMessage('Could Not Find User');
    }
  }
  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(@Query() data: getAllUsersDto) {
    this.logger.log(`get All users data ${JSON.stringify(data)}`);
    try {
      const findUser = await this.usersService.getAllUser(data);
      this.logger.log(`find all users ${JSON.stringify(findUser)}`);
      if (!findUser) {
        this.logger.error(
          `users not found ${JSON.stringify(findUser)},data: ${JSON.stringify(
            data,
          )}`,
        );
        return getErrorMessage('Could Not found user');
      } else {
        return getSuccessMessage(findUser);
      }
    } catch (error) {
      this.logger.error(
        `Could Not Find User with given params: ${JSON.stringify(
          data,
        )},error: ${error}`,
      );
      return getErrorMessage('Could Not Find User with given params');
    }
  }
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedUser(@Param('id') id: number) {
    this.logger.log(`Deleting user id: ${JSON.stringify(id)}`);
    try {
      const findUser = await this.usersService.isUser(id);
      this.logger.log(`is user or not found: ${JSON.stringify(findUser)}`);
      if (!findUser) {
        this.logger.log(
          `this is not user this is hacker banned: ${JSON.stringify(findUser)}`,
        );
        return getErrorMessage('u are not users');
      }
      const deleted = await this.usersService.deleteUser(Number(id));
      this.logger.log(`deleted user: ${JSON.stringify(deleted)}`);
      if (!deleted) {
        this.logger.error(
          `deleted user not found: ${JSON.stringify(
            deleted,
          )}, id: ${JSON.stringify(id)}`,
        );
        return getErrorMessage('Could Not deleted user');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch (error) {
      this.logger.error(
        `Could Not Find User with given params, id: ${JSON.stringify(
          id,
        )},error: ${error}`,
      );
      return getErrorMessage('Could Not deleted user with given params');
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(@Param('id') id: number, @Body() data: UsersInterface) {
    this.logger.log(
      `update users id: ${JSON.stringify(id)} and body: ${JSON.stringify(
        data,
      )} `,
    );
    try {
      const findUser = await this.usersService.isUser(id);
      this.logger.log(`find user: ${JSON.stringify(findUser)}`);
      if (!findUser) {
        this.logger.error(
          `this is not user:${JSON.stringify(findUser)},id: ${JSON.stringify(
            id,
          )},body: ${JSON.stringify(data)}`,
        );
        return getErrorMessage('u are not users');
      }
      const updated = await this.usersService.updateUser(id, data);
      this.logger.log(`updated user: ${JSON.stringify(updated)}`);
      if (!updated) {
        this.logger.error(
          `updated user not found: ${JSON.stringify(
            updated,
          )}, id: ${JSON.stringify(id)}, body: ${JSON.stringify(data)}`,
        );
        return getErrorMessage('Could nor updated user');
      } else {
        return getSuccessMessage(updated);
      }
    } catch (error) {
      this.logger.error(
        `Could Not updated User with given params, id: ${JSON.stringify(
          id,
        )},body: ${JSON.stringify(data)},error: ${error}`,
      );
      return getErrorMessage('Could uodated user with given params');
    }
  }
}
