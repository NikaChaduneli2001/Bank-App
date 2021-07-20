import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { usersInterface } from 'src/interface/users.interface';
import { getErrorMessage } from 'src/utils/response-functions.utils';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';

@Injectable()
export class UsersMysqlService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async registerUser(data: registerUsersDto) {
    const salt = await bcrypt.genSalt();
    const newUser: UsersEntity = new UsersEntity();
    newUser.email = data.email;
    newUser.hash = await bcrypt.hash(data.password, salt);
    newUser.fullName = data.fullName;
    newUser.phone = data.phone;
    newUser.personalNumber = data.personalNumber;
    newUser.role = data.role;
    newUser.time = data.time;
    newUser.deleted = false;
    const user = await this.usersRepository.save(newUser);
    return {
      // use cardCode
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      time: user.time,
      role: user.role,
    };
  }
  // FOR USERS
  async getUserByPersonalNumber(personalNumber: number) {
    const findUser = await this.usersRepository.findOne({
      where: { personalNumber: personalNumber },
    });
    if (!findUser) {
      return getErrorMessage('User not found');
    }
    if (findUser.role === 'user') {
      return {
        id: findUser.id,
        fullName: findUser.fullName,
        role: findUser.role,
      };
    } else {
      return null;
    }
  }

  async getAllUser(data: getAllUsersDto) {
    const query = await this.usersRepository.createQueryBuilder();
    query.where('deleted=false');
    if (data.searchBy.fullName) {
      query.andWhere('fullName like :UsersFullName', {
        UsersFullName: `%${this.escapeLikeString(data.searchBy.fullName)}%`,
      });
    } else if (data.searchBy.email) {
      query.andWhere('email like :UsersEmail', {
        UsersEmail: `%${data.searchBy.email}%`,
      });
    } else if (data.searchBy.role) {
      query.andWhere('role like :UsersRole', {
        UsersRole: `%${this.escapeLikeString(data.searchBy.role)}%`,
      });
    } else if (data.searchBy.personalNumber) {
      query.andWhere('personalNumber like :UsersPersonalNumber', {
        UsersPersonalNumber: `%${data.searchBy.personalNumber}%`,
      });
    }

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 25;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const resilt = await query.getMany();
    if (resilt) {
      return resilt.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        personalNumber: user.personalNumber,
        role: user.role,
      }));
    } else {
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }
  async deleteUser(id: number) {
    await this.usersRepository.save({
      id,
      deleted: true,
    });
    const result = await this.usersRepository.findOne({ id });
    if (result) {
      return {
        id: result.id,
        fullName: result.fullName,
        email: result.email,
        role: result.role,
      };
    } else {
      return null;
    }
  }
}
