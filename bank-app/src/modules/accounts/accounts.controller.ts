import { Body, Get, Post, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
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
      return getSuccessMessage(newAccount);
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
}
