import { Injectable } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { TransactionMysqlService } from 'src/repositories/transaction/trasactions_mysql.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepo: TransactionMysqlService) {}

  async createTrnasaction(data: createTransactionDto) {
    try {
      const sameOwner = await this.transactionRepo.sameOwner(
        data.senderId,
        data.receiverId,
      );
      data.type = sameOwner
        ? TransactionType.Transfer
        : TransactionType.Private;

      const newTransaction = await this.transactionRepo.createTrnasaction(
        data,
        sameOwner,
      );

      const balancig = await this.transactionRepo.transactionsBetweenUsers(
        newTransaction,
      );
      return { newTransaction, balancig };
    } catch {
      return null;
    }
  }
}
