import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesEntity } from 'src/entities/services.entity';
import { ServiceMySqlService } from './service_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServicesEntity])],
  providers: [ServiceMySqlService],
  exports: [ServiceMySqlService],
})
export class ServiceMySqlModule {}
