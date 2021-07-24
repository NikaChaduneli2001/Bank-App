import { Module } from '@nestjs/common';
import { AccountMysqlsModule } from '../repositories/accounts/accounts_mysql.module';
import { AccountsMysqlService } from '../repositories/accounts/accounts_mysql.repository';
import { ServiceController } from './serv.controller';
import { ServiceService } from './serv.service';

@Module({
  imports: [AccountMysqlsModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class AccountsModule {}
