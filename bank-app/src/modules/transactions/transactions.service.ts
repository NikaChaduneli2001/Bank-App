import { Injectable } from '@nestjs/common';
import { TransactionMysqlService } from 'src/repositories/transaction/trasactions_mysql.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepo: TransactionMysqlService) {}
}
