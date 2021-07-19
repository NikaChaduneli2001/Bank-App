import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUsersDto } from 'src/dto/register-users.dto';
import { UsersEntity } from 'src/entities/users.entity';
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
}
