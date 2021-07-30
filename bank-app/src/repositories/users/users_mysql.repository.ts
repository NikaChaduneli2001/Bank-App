import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersInterface } from 'src/interface/users.interface';
import { getErrorMessage } from 'src/utils/response-functions.utils';
import { getAllUsersDto } from 'src/dto/get-all-users.dto';
import { AccountEntity } from 'src/entities/account.entity';

@Injectable()
export class UsersMysqlService {
  private readonly logger = new Logger(UsersMysqlService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async isUser(userId: number) {
    this.logger.log(`chek user id: ${userId}`);
    const findUser = await this.usersRepository.findOne(userId);
    this.logger.log(`is user :${findUser}`);
    if (!findUser) {
      this.logger.error(`user not found: ${userId}`);
      return false;
    } else {
      return findUser;
    }
  }

  async registerUser(data: registerUsersDto) {
    this.logger.log(`registering user data: ${data}`);
    const salt = await bcrypt.genSalt();
    const newUser = new UsersEntity();
    newUser.email = data.email;
    newUser.hash = await bcrypt.hash(data.password, salt);
    newUser.fullName = data.fullName;
    newUser.phone = data.phone;
    newUser.personalNumber = data.personalNumber;
    newUser.role = data.role;
    newUser.time = data.time;
    newUser.deleted = false;
    const user = await this.usersRepository.save(newUser);
    this.logger.log(`registered user : ${user}`);
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      time: user.time,
      role: user.role,
    };
  }

  async getUserByPersonalNumber(personalNumber: string) {
    this.logger.log(`users personal number: ${personalNumber}`);
    const findUser = await this.usersRepository.findOne({
      where: { personalNumber: personalNumber },
    });
    this.logger.log(`find user by personal number: ${findUser}`);
    if (!findUser) {
      this.logger.error(
        `user not found with personal number: ${personalNumber}`,
      );
      return getErrorMessage('User not found');
    }
    if (findUser.role === 'user') {
      return {
        id: findUser.id,
        fullName: findUser.fullName,
        role: findUser.role,
        personalNumber: findUser.personalNumber,
      };
    } else {
      this.logger.error(
        `user role not user, you can not this get with given pernonal number ${personalNumber}`,
      );
      return null;
    }
  }

  async findUserByEmailAndPassword(email: string, password: string) {
    this.logger.log(`check user by email and password:${email}and${password}`);
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    this.logger.log(`found user by email and password:${user}`);
    if (!user) {
      this.logger.error(
        `user not found with email${email} and password${password},user: ${user}`,
      );
      return null;
    }
    const isPasswordCorect = bcrypt.compare(password, user.hash);
    this.logger.log(`password is corect:${isPasswordCorect}`);
    if (!isPasswordCorect) {
      this.logger.error(`password is not corect:${isPasswordCorect}`);
      return null;
    } else {
      return user;
    }
  }
  async findUserByPersonalNumber(personalNumber: string) {
    this.logger.log(`users personal number for admin: ${personalNumber}`);
    const findUser = await this.usersRepository.findOne({
      where: { personalNumber: personalNumber },
    });
    this.logger.log(`find user by personal number: ${findUser}`);
    if (!findUser) {
      this.logger.error(
        `user not found with personal number: ${personalNumber}`,
      );
      return getErrorMessage('User not found');
    } else {
      return {
        id: findUser.id,
        fullName: findUser.fullName,
        role: findUser.role,
        email: findUser.email,
        phone: findUser.phone,
        personalNumber: findUser.personalNumber,
      };
    }
  }
  async getAllUser(data: getAllUsersDto) {
    this.logger.log(`get all users data: ${data}`);
    const query = await this.usersRepository.createQueryBuilder();
    this.logger.log(`get all users queryParams: ${query}`);
    query.where('deleted=false');
    if (data.searchBy) {
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
    }

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 0;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(data.limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getMany();
    this.logger.log(`find all user:${result}`);
    if (result) {
      return result.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        personalNumber: user.personalNumber,
        role: user.role,
      }));
    } else {
      this.logger.error(`users not found with given params:${data}`);
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }
  async deleteUser(id: number) {
    this.logger.log(`deleting user id:${id}`);
    await this.usersRepository.save({
      id,
      deleted: true,
    });
    const result = await this.usersRepository.findOne({ id });
    this.logger.log(`found deleted user:${result}`);
    if (result) {
      return {
        id: result.id,
        fullName: result.fullName,
        email: result.email,
        role: result.role,
      };
    } else {
      this.logger.error(`User could not be deleted user with id ${id}`);
      return null;
    }
  }
  async updateUser(id: number, user: UsersInterface) {
    this.logger.log(`updateing users id:${id}and body: ${user}`);
    await this.usersRepository.save({
      id,
      user,
    });

    const updatedUser = await this.usersRepository.findOne({ id });
    this.logger.log(`found updated user:${updatedUser}`);
    if (updatedUser) {
      return {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        personalNumber: updatedUser.personalNumber,
      };
    } else {
      this.logger.error(`User could not be updated user with id ${id}`);
      return null;
    }
  }
}
