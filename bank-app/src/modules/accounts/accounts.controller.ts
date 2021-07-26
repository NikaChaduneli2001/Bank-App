import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { accountInterface } from 'src/interface/account.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post()
  async createAccount(@Body() data: createAccountDto) {
    try {
      const newAccount = await this.accountService.createAccount(data);
      if (!newAccount) {
        return getErrorMessage('Could not create account with given params');
      } else {
        return getSuccessMessage(newAccount);
      }
    } catch {
      return getErrorMessage('Could not create account');
    }
  }

  @Get()
  async getAccount(@Query() data: getAllAccountsDto) {
    try {
      const account = await this.accountService.getAllAccounts(data);
      if (!account) {
        return getErrorMessage('Could not get account');
      } else {
        return getSuccessMessage(account);
      }
    } catch {
      return getErrorMessage('Could not get account with given params');
    }
  }

  @Delete(':id')
  async deletedAccount(@Param('id') id: number) {
    try {
      const deleted = await this.accountService.deletedAccont(Number(id));
      if (!deleted) {
        return getErrorMessage('Could not delete account');
      } else {
        return getSuccessMessage(deleted);
      }
    } catch {
      return getErrorMessage('Could not delete account with given params');
    }
  }

  @Put(':id')
  async updateAccount(@Param('id') id: number, data: accountInterface) {
    try {
      const updated = await this.accountService.updateAccount(id, data);
      if (!updated) {
        return getErrorMessage('Could not update account');
      } else {
        return getSuccessMessage(updated);
      }
    } catch {
      return getErrorMessage('Could not update account with given params');
    }
  }
}
