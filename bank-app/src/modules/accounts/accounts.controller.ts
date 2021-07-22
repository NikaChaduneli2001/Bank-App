import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
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
}
