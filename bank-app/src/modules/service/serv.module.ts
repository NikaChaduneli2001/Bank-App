import { Module } from '@nestjs/common';
import { ServiceMySqlModule } from '../../repositories/services/service_mysql.module';
import { ServiceController } from './serv.controller';
import { ServiceService } from './serv.service';

@Module({
  imports: [ServiceMySqlModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class AccountsModule {}
