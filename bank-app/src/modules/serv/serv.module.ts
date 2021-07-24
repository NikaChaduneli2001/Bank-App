import { Module } from '@nestjs/common';
import { AccountMysqlsModule } from '../repositories/accounts/accounts_mysql.module';
import { AccountsMysqlService } from '../repositories/accounts/accounts_mysql.repository';
import { ServMySqlModule } from '../repositories/serv/service_mysql.module';
import { ServiceController } from './serv.controller';
import { ServiceService } from './serv.service';

@Module({
  imports: [ServMySqlModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class AccountsModule {}
