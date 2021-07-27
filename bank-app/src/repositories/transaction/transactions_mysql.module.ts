import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/entities/trasaction.entity';
import { TransactionMysqlService } from './trasactions_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionMysqlService],
  exports: [TransactionMysqlService],
})
export class TransactionMysqlModule {}
