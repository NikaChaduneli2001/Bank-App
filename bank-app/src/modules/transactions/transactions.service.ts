import { Injectable, Logger } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { fillBlanaceDto } from 'src/dto/fill-balance.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { TransactionInterface } from 'src/interface/transactions.interface';
import { TransactionMysqlService } from 'src/repositories/transaction/trasactions_mysql.repository';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
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
    this.logger.log(`crete transactions data :${JSON.stringify(data)}`);
    try {
      const sameOwner = await this.transactionRepo.sameOwner(
        data.senderId,
        data.receiverId,
      );
      this.logger.log(`same Owner :${JSON.stringify(sameOwner)}`);
      data.type = sameOwner
        ? TransactionType.Transfer
        : TransactionType.Private;

      const newTransaction = await this.transactionRepo.createTrnasaction(
        data,
        sameOwner,
      );
      this.logger.log(`new transactions : ${JSON.stringify(newTransaction)}`);

      const balancig = await this.transactionRepo.transactionsBetweenUsers(
        newTransaction,
      );
      this.logger.log(`balancig :${JSON.stringify(balancig)}`);
      return { newTransaction, balancig };
    } catch (error) {
      this.logger.error(
        `could not created transactions with given params :${JSON.stringify(
          data,
        )}, error: ${error}`,
      );
      return null;
    }
  }

  async getAllTransactios(data: getAllTransactiosDto) {
    try {
      const transactions = await this.transactionRepo.getAllTransactios(data);
      if (!transactions) {
        return false;
      }
      return transactions;
    } catch {
      return null;
    }
  }
  async getSenderTransactionsWithSenderId(senderId: number) {
    try {
      const senderTrnsactions =
        await this.transactionRepo.getSendersTransactionsWithSenderId(senderId);
      if (!senderTrnsactions) {
        return false;
      }
      return senderTrnsactions;
    } catch {
      return null;
    }
  }

  async deleteTransactions(transactionId: number) {
    try {
      const deleted = await this.transactionRepo.deleteTransactions(
        transactionId,
      );
      if (!deleted) throw new Error('transaction was not deleted');
      return deleted;
    } catch {
      return null;
    }
  }

  async updateTransactionStatus(id: number, status: TransactionStatus) {
    try {
      const updated = await this.transactionRepo.updateTransactionStatus(
        id,
        status,
      );
      if (!updated)
        throw new Error('transaction was not updated transaction status');
      return updated;
    } catch {
      return null;
    }
  }

  async updateTransaction(id: number, update: TransactionInterface) {
    try {
      const updatedTransaction = await this.transactionRepo.updateTransaction(
        id,
        update,
      );
      if (!updatedTransaction)
        throw new Error('transaction was not updated transaction');
    } catch {
      return null;
    }
  }

  async transferIntoAccount(data: fillBlanaceDto) {
    this.logger.log(
      `transafer into account fill balance Dto: ${JSON.stringify(data)}`,
    );
    try {
      if ((data.type = TransactionType.Transfer)) {
        this.logger.log(`data type: ${JSON.stringify(data.type)}`);
        const newDeposit = await this.transactionRepo.transferIntoAccount(data);
        if (!newDeposit) {
          return false;
        }
        this.logger.log(`new Deposit: ${JSON.stringify(newDeposit)}`);
        data.amount = Math.abs(data.amount);
        this.logger.log(`amount: ${JSON.stringify(data.amount)}`);
        await this.transactionRepo.fillBalance(data);
        return newDeposit;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Transfer cannot be done with given data :${JSON.stringify(data)}`,
      );
      return null;
    }
  }
}
