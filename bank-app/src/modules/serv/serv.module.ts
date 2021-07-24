import { Module } from '@nestjs/common';
import { AccountMysqlsModule } from '../repositories/accounts/accounts_mysql.module';
import { AccountsMysqlService } from '../repositories/accounts/accounts_mysql.repository';
import { AccountsController } from './serv.controller';
import { AccountsService } from './serv.service';

@Module({
  imports: [AccountMysqlsModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
