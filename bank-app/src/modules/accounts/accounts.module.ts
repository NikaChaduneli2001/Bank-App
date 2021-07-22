import { Module } from '@nestjs/common';
import { AccountMysqlsModule } from '../repositories/accounts/accounts_mysql.module';
import { AccountsMysqlService } from '../repositories/accounts/accounts_mysql.repository';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [AccountMysqlsModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
