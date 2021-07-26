import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountsMysqlService } from './accounts_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountsMysqlService],
  exports: [AccountsMysqlService],
})
export class AccountMysqlsModule {}
