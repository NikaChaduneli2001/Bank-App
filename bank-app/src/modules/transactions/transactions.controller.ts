import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
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
}
