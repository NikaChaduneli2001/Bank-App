import { Injectable } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { fillBlanaceDto } from 'src/dto/fill-balance.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { TransactionInterface } from 'src/interface/transactions.interface';
import { TransactionMysqlService } from 'src/repositories/transaction/trasactions_mysql.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepo: TransactionMysqlService) {}

  async belongsToUser(transactionId: number, userId: number) {
    try {
      return await this.transactionRepo.transactionBelongsToUser(
        transactionId,
        userId,
      );
    } catch {
      return null;
    }
  }
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

  async getAllTransactios(data: getAllTransactiosDto) {
    try {
      return await this.transactionRepo.getAllTransactios(data);
    } catch {
      return null;
    }
  }
  async getSenderTransactionsWithSenderId(senderId: number) {
    try {
      return await this.transactionRepo.getSenderTransactionsWithSenderId(
        senderId,
      );
    } catch {
      return null;
    }
  }

  async deleteTransactions(transactionId: number) {
    try {
      return await this.transactionRepo.deleteTransactions(transactionId);
    } catch {
      return null;
    }
  }

  async updateTransactionStatus(id: number, status: TransactionStatus) {
    try {
      return await this.transactionRepo.updateTransactionStatus(id, status);
    } catch {
      return null;
    }
  }

  async updateTransaction(id: number, update: TransactionInterface) {
    try {
      return await this.transactionRepo.updateTransaction(id, update);
    } catch {
      return null;
    }
  }

  async transferIntoAccount(data: fillBlanaceDto) {
    try {
      data.type = TransactionType.Transfer;
      const newDeposit = await this.transactionRepo.transferIntoAccount(data);
      data.amount = Math.abs(data.amount);
      await this.transactionRepo.fillBalance(data);
      return newDeposit;
    } catch {
      return null;
    }
  }
}
