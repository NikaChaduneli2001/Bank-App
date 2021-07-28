import { Delete, Get, Query } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionInterface } from 'src/interface/transactions.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  async createTransactions(@Body() data: createTransactionDto) {
    try {
      const transactions = await this.transactionService.createTrnasaction(
        data,
      );
      if (!transactions) {
        return getErrorMessage('could not create transaction');
      } else {
        return getSuccessMessage(transactions);
      }
    } catch {
      return getErrorMessage('Could not create transaction with given params');
    }
  }

  @Get()
  async getAllTransactios(@Query() data: getAllTransactiosDto) {
    try {
      const result = await this.transactionService.getAllTransactios(data);
      if (!result) {
        return getErrorMessage('Could not create transaction');
      } else {
        return getSuccessMessage(result);
      }
    } catch {
      return getErrorMessage('Could not create transaction with given params');
    }
  }

  @Get(':senderId')
  async getSenderTransactionsWithSenderId(@Req() req) {
    try {
      const { user } = req;
      const findSenderTransaction =
        await this.transactionService.getSenderTransactionsWithSenderId(
          user.senderId,
        );
      if (!findSenderTransaction) {
        return getErrorMessage('Could not find sender transaction');
      } else {
        return getSuccessMessage(findSenderTransaction);
      }
    } catch {
      return getErrorMessage(
        'Could not find sender transaction with given params',
      );
    }
  }

  @Delete(':id')
  async deletedTransaction(@Param('id') id: number, @Req() req) {
    try {
      const { user } = req;
      const belongsToUser = await this.transactionService.belongsToUser(
        id,
        user.userId,
      );
      if (!belongsToUser) {
        return getErrorMessage('You are not our user');
      }
      const deleted = await this.transactionService.deleteTransactions(
        Number(id),
      );
      if (!deleted) {
        return getErrorMessage('Could not delete transaction');
      } else {
        return getSuccessMessage('Successfully deleted transaction');
      }
    } catch {
      return getErrorMessage('Could not delete transaction with given params');
    }
  }
  @Put(':id')
  async updateTransactionStatus(
    @Param('id') id: number,
    @Body() status: TransactionStatus,
    @Req() req,
  ) {
    try {
      const { user } = req;
      const belongs = await this.transactionService.belongsToUser(
        Number(id),
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('You are not our user');
      }
      const updated = await this.transactionService.updateTransactionStatus(
        Number(id),
        status,
      );
      if (!updated) {
        return getErrorMessage('Could not update transaction status');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage(
        'Could not update transaction status with given id',
      );
    }
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: number,
    update: TransactionInterface,
    @Req() req,
  ) {
    try {
      const { user } = req;
      const belongs = await this.transactionService.belongsToUser(
        id,
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('You are not our user');
      }
      const updated = await this.transactionService.updateTransaction(
        id,
        update,
      );
      if (!updated) {
        return getErrorMessage('Could update transaction');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage('Could not update transaction with given params');
    }
  }
}
