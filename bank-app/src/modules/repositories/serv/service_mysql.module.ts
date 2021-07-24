import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesEntity } from 'src/entities/services.entity';
import { ServMySqlService } from './service_mysql.repository';


@Module({
    imports: [TypeOrmModule.forFeature([ServicesEntity])],
    providers: [ServMySqlService],
    exports: [ServMySqlService],
  })
  export class servMySqlModule {}
