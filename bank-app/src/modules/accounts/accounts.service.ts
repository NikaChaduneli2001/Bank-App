import { Injectable } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { AccountsMysqlService } from '../repositories/accounts/accounts_mysql.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepo: AccountsMysqlService) {}

  async createAccount(data: createAccountDto) {
    try {
      const account = await this.accountRepo.createAccount(data);
      return account;
    } catch {
      return null;
    }
  }
  async printCreditInfo(cardCode: number) {
    try {
      return await this.accountRepo.printCardInfo(cardCode);
    } catch {
      return null;
    }
  }
}
