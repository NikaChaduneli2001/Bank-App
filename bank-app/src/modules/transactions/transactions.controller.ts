import { Delete, Get, Query } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
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
}
