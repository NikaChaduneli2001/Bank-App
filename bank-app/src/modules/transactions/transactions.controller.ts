import { Delete, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { fillBlanaceDto } from 'src/dto/fill-balance.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
import { Role } from 'src/enums/role.enum';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionInterface } from 'src/interface/transactions.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  async createTransactions(@Body() data: createTransactionDto) {
    this.logger.log(`create transactions body: ${JSON.stringify(data)}`);
    try {
      const transactions = await this.transactionService.createTrnasaction(
        data,
      );
      this.logger.log(`created transactions :${JSON.stringify(transactions)}`);
      if (!transactions) {
        this.logger.error(`could not found transactions`);
        return getErrorMessage('could not create transaction');
      } else {
        return getSuccessMessage(transactions);
      }
    } catch (error) {
      this.logger.error(
        `could not create transactions with given params , body: ${JSON.stringify(
          data,
        )}, error: ${error}`,
      );
      return getErrorMessage('Could not create transaction with given params');
    }
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllTransactios(@Query() data: getAllTransactiosDto) {
    this.logger.log(`get all transactions data: ${JSON.stringify(data)}`);
    try {
      const result = await this.transactionService.getAllTransactios(data);
      this.logger.log(`all transactions result: ${JSON.stringify(result)}`);
      if (!result) {
        this.logger.error(
          `could not get all transactions data : ${JSON.stringify(data)}`,
        );
        return getErrorMessage('Could not get transaction');
      } else {
        return getSuccessMessage(result);
      }
    } catch (error) {
      this.logger.error(
        `could not get all transactions with given params :${JSON.stringify(
          data,
        )}, error: ${error}`,
      );
      return getErrorMessage('Could not get transaction with given params');
    }
  }

  @Get(':senderId')
  async getSenderTransactionsWithSenderId(@Req() req) {
    this.logger.log(`get senders transactions req: ${JSON.stringify(req)}`);
    try {
      const { user } = req;
      const findSenderTransaction =
        await this.transactionService.getSenderTransactionsWithSenderId(
          user.senderId,
        );
      this.logger.log(
        `find senders transactions :${JSON.stringify(findSenderTransaction)}`,
      );
      if (!findSenderTransaction) {
        this.logger.error(`could not found senders transactions`);
        return getErrorMessage('Could not find sender transaction');
      } else {
        return getSuccessMessage(findSenderTransaction);
      }
    } catch (error) {
      this.logger.error(
        `could not find sender transaction with gicen params, req:${JSON.stringify(
          req,
        )},error : ${error}`,
      );
      return getErrorMessage(
        'Could not find sender transaction with given params',
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletedTransaction(@Param('id') id: number, @Req() req) {
    this.logger.log(
      `delete transactions with given id: ${JSON.stringify(
        id,
      )}, req:${JSON.stringify(req.body.userId)}`,
    );
    try {
      const { user } = req;
      const belongsToUser = await this.transactionService.belongsToUser(
        id,
        user.userId,
      );
      this.logger.log(`belongs to user: ${JSON.stringify(belongsToUser)}`);
      if (!belongsToUser) {
        this.logger.error(`not belongsToUser`);
        return getErrorMessage('You are not our user');
      }
      const deleted = await this.transactionService.deleteTransactions(
        Number(id),
      );
      this.logger.log(`deleted transactions :${JSON.stringify(deleted)}`);
      if (!deleted) {
        this.logger.error(
          `could not deleted transactions with given id:${JSON.stringify(
            id,
          )}, req:${JSON.stringify(req)}`,
        );
        return getErrorMessage('Could not delete transaction');
      } else {
        return getSuccessMessage('Successfully deleted transaction');
      }
    } catch (error) {
      this.logger.error(
        `could not delete transaction with given params, id:${JSON.stringify(
          id,
        )}, req:${JSON.stringify(req)},error :${error}`,
      );
      return getErrorMessage('Could not delete transaction with given params');
    }
  }
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTransactionStatus(
    @Param('id') id: number,
    @Body() status: TransactionStatus,
    @Req() req,
  ) {
    this.logger.log(
      `updateing transactions status , id:${JSON.stringify(
        id,
      )}, body: ${JSON.stringify(status)}, req:${JSON.stringify(req)}`,
    );
    try {
      const { user } = req;
      const belongs = await this.transactionService.belongsToUser(
        Number(id),
        user.userId,
      );
      this.logger.log(`belongs : ${JSON.stringify(belongs)}`);
      if (!belongs) {
        this.logger.error(`cont belongs`);
        return getErrorMessage('You are not our user');
      }
      const updated = await this.transactionService.updateTransactionStatus(
        Number(id),
        status,
      );
      this.logger.log(
        `updated transactions status :${JSON.stringify(updated)}`,
      );
      if (!updated) {
        this.logger.error(
          `could not updated transactions status with given , id: ${JSON.stringify(
            id,
          )}, req : ${JSON.stringify(req)}`,
        );
        return getErrorMessage('Could not update transaction status');
      } else {
        return getSuccessMessage(updated);
      }
    } catch (error) {
      this.logger.log(
        `Could not update transaction status with given , id:${JSON.stringify(
          id,
        )}, body: ${JSON.stringify(status)}, req:${JSON.stringify(
          req,
        )}, error : ${error}`,
      );
      return getErrorMessage(
        'Could not update transaction status with given id',
      );
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTransaction(
    @Param('id') id: number,
    update: TransactionInterface,
    @Req() req,
  ) {
    this.logger.log(
      `updateing transactio, id:${JSON.stringify(id)}, req:${JSON.stringify(
        req,
      )}, transactions interface :${JSON.stringify(update)},`,
    );
    try {
      const { user } = req;
      const belongs = await this.transactionService.belongsToUser(
        id,
        user.userId,
      );
      this.logger.log(`belongs :${JSON.stringify(belongs)},`);
      if (!belongs) {
        this.logger.error(`not belongs`);
        return getErrorMessage('You are not our user');
      }
      const updated = await this.transactionService.updateTransaction(
        id,
        update,
      );
      this.logger.log(`updated transaction : ${JSON.stringify(updated)}`);
      if (!updated) {
        this.logger.error(`could not updated transactions`);
        return getErrorMessage('Could not update transaction');
      } else {
        return getSuccessMessage(updated);
      }
    } catch (error) {
      this.logger.error(
        `could not updated transactions with given params , id:${JSON.stringify(
          id,
        )}, req:${JSON.stringify(req)}, interfaces: ${JSON.stringify(
          update,
        )}, error : ${error}`,
      );
      return getErrorMessage('Could not update transaction with given params');
    }
  }
  @Post('/balance/transfer')
  @Roles(Role.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async transeferIntoAccount(@Body() body: fillBlanaceDto) {
    this.logger.log(`fill balance dto :${JSON.stringify(body)}`);
    try {
      const newDeposit = await this.transactionService.transferIntoAccount(
        body,
      );
      this.logger.log(`new deposit :${JSON.stringify(newDeposit)}`);
      newDeposit['info'] = 'Bank Operation';
      return getSuccessMessage(newDeposit);
    } catch (error) {
      this.logger.error(
        `could not create Deposit with given param , body:${JSON.stringify(
          body,
        )}`,
      );
      return getErrorMessage(`could not create Deposit`);
    }
  }
}
