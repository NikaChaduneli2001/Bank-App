import { Injectable } from '@nestjs/common';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all-accounts.dto';
import { AccountInterface } from 'src/interface/account.interface';
import { getErrorMessage } from 'src/utils/response-functions.utils';
import { AccountsMysqlService } from '../../repositories/accounts/accounts_mysql.repository';

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
  async accountBelongsToUser(accountId: number, userId: number) {
    try {
      return await this.accountRepo.accountBelongsToUser(accountId, userId);
    } catch {
      return null;
    }
  }
  async getAllAccounts(data: getAllAccountsDto) {
    try {
      const findAccounts = await this.accountRepo.getAllAccounts(data);
      return findAccounts;
    } catch {
      return null;
    }
  }

  async deletedAccont(id: number) {
    try {
      return await this.deletedAccont(id);
    } catch {
      return null;
    }
  }
  async updateAccount(id: number, data: AccountInterface) {
    try {
      return await this.accountRepo.updateAccount(id, data);
    } catch {
      return null;
    }
  }
  async getUsersAccount(userId: number) {
    try {
      return await this.accountRepo.getUsersAccount(userId);
    } catch {
      return null;
    }
  }

  async getCompanyAccount(companyId: number) {
    try {
      return await this.accountRepo.getCompanyAccount(companyId);
    } catch {
      return null;
    }
  }
}
