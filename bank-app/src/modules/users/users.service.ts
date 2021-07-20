import { Injectable } from '@nestjs/common';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { usersInterface } from 'src/interface/users.interface';
import { UsersMysqlService } from '../repositories/users/users_mysql.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersMysqlService) {}

  async registerUser(data: registerUsersDto) {
    try {
      const result = await this.usersRepo.registerUser(data);
      return result;
    } catch {
      return null;
    }
  }
  async getUserByPersonalNumber(data: usersInterface) {
    try {
      return await this.usersRepo.getUserByPersonalNumber(
        data.personalNumber,
      );
    } catch {
      return null;
    }
  }

  async getAllUser(data: getAllUsersDto) {
    try {
      return await this.usersRepo.getAllUser(data);
    } catch {
      return null;
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.usersRepo.deleteUser(Number(id));
    } catch {
      return null;
    }
  }

  async updateUser(id: number, data: usersInterface) {
    try {
      return await this.usersRepo.updateUser(Number(id), data);
    } catch {
      return null;
    }
  }
}
