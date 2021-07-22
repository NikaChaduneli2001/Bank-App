import { Injectable } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { AccountsMysqlService } from '../repositories/accounts/accounts_mysql.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountRepo: AccountsMysqlService) {}

  async createAccount(data: createAccountDto) {
    try {
      return await this.accountRepo.createAccount(data);
    } catch {
      return null;
    }
  }
  async printCreditInfo(cardCode: number) {
    try {
      return await this.accountRepo.printCreditInfo(cardCode);
    } catch {
      return null;
    }
  }
}
