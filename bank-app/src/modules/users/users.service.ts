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
    this.logger.log(`User check, id: ${JSON.stringify(userId)}`);
    try {
      const user = await this.usersRepo.isUser(userId);
      this.logger.log(`is user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(
        `user not found with id ${JSON.stringify(userId)},error ${error}`,
      );
      return null;
    }
  }
  async registerUser(data: registerUsersDto) {
    this.logger.log(`registered user ${JSON.stringify(data)}`);
    try {
      const result = await this.usersRepo.registerUser(data);
      this.logger.log(`registered user ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(
        `could not register user ${JSON.stringify(data)},error ${error}`,
      );
      return null;
    }
  }
  async getUserByPersonalNumber(personalNumber: string) {
    this.logger.log(`users personal number: ${JSON.stringify(personalNumber)}`);
    try {
      const findUser = await this.usersRepo.getUserByPersonalNumber(
        personalNumber,
      );
      this.logger.log(`find user: ${JSON.stringify(findUser)}`);
      return findUser;
    } catch (error) {
      this.logger.error(
        `could not update user ${JSON.stringify(error)},error ${error}`,
      );
      return null;
    }
  }
  async findUserByEmailAndPassword(email: string, password: string) {
    this.logger.log(
      `check users email and password :${JSON.stringify(
        email,
      )} and ${JSON.stringify(password)}`,
    );
    try {
      const findUser = await this.usersRepo.findUserByEmailAndPassword(
        email,
        password,
      );
      this.logger.log(`found user :${JSON.stringify(findUser)}`);
      return findUser;
    } catch (error) {
      this.logger.error(
        `could not find user with email and password :${JSON.stringify(
          email,
        )},${JSON.stringify(password)},error ${error}`,
      );
      return null;
    }
  }
  async findUserByPersonalNumber(personalNumber: string) {
    this.logger.log(
      `found user personal number :${JSON.stringify(personalNumber)}`,
    );
    try {
      const foundUser = await this.usersRepo.getUserByPersonalNumber(
        personalNumber,
      );
      this.logger.log(`found user: ${JSON.stringify(foundUser)}`);
      return foundUser;
    } catch (error) {
      this.logger.error(
        `could not find user with personal number ${JSON.stringify(
          personalNumber,
        )},error ${error}`,
      );
      return null;
    }
  }

  async getAllUser(data: getAllUsersDto) {
    this.logger.log(`get all users data: ${JSON.stringify(data)}`);
    try {
      const getUsers = await this.usersRepo.getAllUser(data);
      this.logger.log(`get all users: ${JSON.stringify(getUsers)}`);
      return getUsers;
    } catch (error) {
      this.logger.error(
        `could not get all users data: ${JSON.stringify(data)},error: ${error}`,
      );
      return null;
    }
  }

  async deleteUser(id: number) {
    this.logger.log(`deleting user :${JSON.stringify(id)}`);
    try {
      const deletedUser = await this.usersRepo.deleteUser(Number(id));
      this.logger.log(`deleted user: ${JSON.stringify(deletedUser)}`);
      return deletedUser;
    } catch (error) {
      this.logger.error(
        `could not deleted user with id ${JSON.stringify(id)},error: ${error}`,
      );
      return null;
    }
  }

  async updateUser(id: number, data: UsersInterface) {
    this.logger.log(
      `update user with id ${JSON.stringify(id)} and data: ${JSON.stringify(
        data,
      )}`,
    );
    try {
      const updatedUser = await this.usersRepo.updateUser(Number(id), data);
      this.logger.log(`updated user with id ${JSON.stringify(updatedUser)}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `could not updated user with id ${JSON.stringify(id)},error: ${error}`,
      );
      return null;
    }
  }
}
