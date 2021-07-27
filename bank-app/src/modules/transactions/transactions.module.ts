import { Module } from '@nestjs/common';
import { TransactionMysqlModule } from 'src/repositories/transaction/transactions_mysql.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TransactionMysqlModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
