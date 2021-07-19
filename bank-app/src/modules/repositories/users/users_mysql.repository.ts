import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      time: user.time,
      role: user.role,
    };
  }
}
