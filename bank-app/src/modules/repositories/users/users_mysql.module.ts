import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { AccountMysqlsModule } from '../accounts/accounts_mysql.module';
import { UsersMysqlService } from './users_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersMysqlService],
  exports: [UsersMysqlService],
})
export class UsersMysqlModule {}
