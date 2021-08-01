import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { CompanyMysqlService } from './company_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity,UsersEntity])],
  providers: [CompanyMysqlService],
  exports: [CompanyMysqlService],
})
export class CompanyMysqlModule {}
