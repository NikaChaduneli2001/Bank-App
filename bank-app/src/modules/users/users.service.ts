import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { usersInterface } from 'src/interface/users.interface';
import { UsersMysqlService } from '../repositories/users/users_mysql.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: UsersMysqlService,
  ) {}

  async registerUser(data: registerUsersDto) {
    try {
      return await this.usersRepository.registerUser(data);
    } catch {
      return null;
    }
  }
  async getUserByPersonalNumber(data: usersInterface) {
    try {
      return await this.usersRepository.getUserByPersonalNumber(
        data.personalNumber,
      );
    } catch {
      return null;
    }
  }

  async getAllUser(data: getAllUsersDto) {
    try {
      return await this.usersRepository.getAllUser(data);
    } catch {
      return null;
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.usersRepository.deleteUser(Number(id));
    } catch {
      return null;
    }
  }

  async updateUser(id: number, data: usersInterface) {
    try {
      return await this.usersRepository.updateUser(Number(id), data);
    } catch {
      return null;
    }
  }
}
