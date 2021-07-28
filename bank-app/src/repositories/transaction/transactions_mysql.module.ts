import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { TransactionEntity } from 'src/entities/trasaction.entity';
import { TransactionMysqlService } from './trasactions_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, AccountEntity])],
  providers: [TransactionMysqlService],
  exports: [TransactionMysqlService],
})
export class TransactionMysqlModule {}
