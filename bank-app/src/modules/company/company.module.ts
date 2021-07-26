import { Module } from '@nestjs/common';
import { CompanyMysqlModule } from '../repositories/company/company_mysql.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [CompanyMysqlModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
