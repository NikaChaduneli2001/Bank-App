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
      if (!account) {
        return false;
      }
      return account;
    } catch {
      return null;
    }
  }
  async accountBelongsToUser(accountId: number, userId: number) {
    try {
      const belongs = await this.accountRepo.accountBelongsToUser(
        accountId,
        userId,
      );
      if (!belongs) {
        return false;
      }
      return belongs;
    } catch {
      return null;
    }
  }
  async getAllAccounts(data: getAllAccountsDto) {
    try {
      const findAccounts = await this.accountRepo.getAllAccounts(data);
      if (!findAccounts) throw new Error('accounts not found');
      return findAccounts;
    } catch {
      return null;
    }
  }

  async deletedAccont(id: number) {
    try {
      const deleted = await this.deletedAccont(id);
      if (!deleted) throw new Error('account not deleted');
      return deleted;
    } catch {
      return null;
    }
  }
  async updateAccount(id: number, data: AccountInterface) {
    try {
      const updated = await this.accountRepo.updateAccount(id, data);
      if (!updated) throw new Error('account not updated');
      return updated;
    } catch {
      return null;
    }
  }
  async getUsersAccount(userId: number) {
    try {
      const usersAccount = await this.accountRepo.getUsersAccount(userId);
      if (!usersAccount) {
        return false;
      }
      return usersAccount;
    } catch {
      return null;
    }
  }

  async getCompanyAccount(companyId: number) {
    try {
      const companyAccount = await this.accountRepo.getCompanyAccount(
        companyId,
      );
      if (!companyAccount) {
        return false;
      }
      return companyAccount;
    } catch {
      return null;
    }
  }
}
