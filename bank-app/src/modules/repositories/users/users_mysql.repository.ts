import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { usersInterface } from 'src/interface/users.interface';
import { getErrorMessage } from 'src/utils/response-functions.utils';

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
