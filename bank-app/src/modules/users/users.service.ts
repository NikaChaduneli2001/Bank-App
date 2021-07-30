import { Injectable, Logger } from '@nestjs/common';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersInterface } from 'src/interface/users.interface';
import { UsersMysqlService } from '../../repositories/users/users_mysql.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepo: UsersMysqlService) {}

  async isUser(userId: number) {
    this.logger.log(`User check, id: ${userId}`);
    try {
      const user = await this.usersRepo.isUser(userId);
      this.logger.log(`is user: ${user}`);
      return user;
    } catch (error) {
      this.logger.error(`user not found with id ${userId},error ${error}`);
      return null;
    }
  }
  async registerUser(data: registerUsersDto) {
    this.logger.log(`registered user ${data}`);
    try {
      const result = await this.usersRepo.registerUser(data);
      this.logger.log(`registered user ${result}`);
      return result;
    } catch (error) {
      this.logger.error(`could not register user ${data},error ${error}`);
      return null;
    }
  }
  async getUserByPersonalNumber(personalNumber: string) {
    this.logger.log(`users personal number: ${personalNumber}`);
    try {
      const findUser = await this.usersRepo.getUserByPersonalNumber(
        personalNumber,
      );
      this.logger.log(`find user: ${findUser}`);
      return findUser;
    } catch (error) {
      this.logger.error(
        `could not update user ${personalNumber},error ${error}`,
      );
      return null;
    }
  }
  async findUserByEmailAndPassword(email: string, password: string) {
    this.logger.log(`check users email and password :${email} and ${password}`);
    try {
      const finduser = await this.usersRepo.findUserByEmailAndPassword(
        email,
        password,
      );
      this.logger.log(`found user :${finduser}`);
      return finduser;
    } catch (error) {
      this.logger.error(
        `could not find user with email and password :${email},${password},error ${error}`,
      );
      return null;
    }
  }
  async findUserByPersonalNumber(personalNumber: string) {
    this.logger.log(`found user personal number :${personalNumber}`);
    try {
      const foundUser = await this.usersRepo.getUserByPersonalNumber(
        personalNumber,
      );
      this.logger.log(`found user: ${foundUser}`);
      return foundUser;
    } catch (error) {
      this.logger.error(
        `could not find user with personal number ${personalNumber},error ${error}`,
      );
      return null;
    }
  }

  async getAllUser(data: getAllUsersDto) {
    this.logger.log(`get all users data: ${data}`);
    try {
      const getUsers = await this.usersRepo.getAllUser(data);
      this.logger.log(`get all users: ${getUsers}`);
      return getUsers;
    } catch (error) {
      this.logger.error(
        `could not get all users data: ${data},error: ${error}`,
      );
      return null;
    }
  }

  async deleteUser(id: number) {
    this.logger.log(`deleting user :${id}`);
    try {
      const deletedUser = await this.usersRepo.deleteUser(Number(id));
      this.logger.log(`deleted user: ${deletedUser}`);
      return deletedUser;
    } catch (error) {
      this.logger.error(`could not deleted user with id ${id},error: ${error}`);
      return null;
    }
  }

  async updateUser(id: number, data: UsersInterface) {
    this.logger.log(`update user with id ${id} and data: ${data}`);
    try {
      const updatedUser = await this.usersRepo.updateUser(Number(id), data);
      this.logger.log(`updated user with id ${updatedUser}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`could not updated user with id ${id},error: ${error}`);
      return null;
    }
  }
}
