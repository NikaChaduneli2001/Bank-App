import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { accountInterface } from 'src/interface/account.interface';
import { usersInterface } from 'src/interface/users.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsMysqlService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async createAccount(data: createAccountDto) {
    if (data.company) {
      const newAccount: AccountEntity = new AccountEntity();
      newAccount.user = data.user;
      newAccount.company = data.company;
      newAccount.balance = data.balance;
      newAccount.cardCode = data.cardCode;
      newAccount.accountNumber = data.accountNumber;
      newAccount.deleted = false;
      const result = await this.accountsRepository.save(newAccount);
      return {
        id: result.id,
        company: result.company,
        userId: result.user,
        balance: result.balance,
        cardCode: await this.printCardInfo(result.cardCode),
        accountNumber: result.accountNumber,
      };
    } else {
      const newAccount: AccountEntity = new AccountEntity();
      newAccount.user = data.user;
      newAccount.balance = data.balance;
      newAccount.cardCode = data.cardCode;
      newAccount.accountNumber = data.accountNumber;
      newAccount.deleted = false;
      const result = await this.accountsRepository.save(newAccount);
      return {
        id: result.id,
        userId: result.user,
        balance: result.balance,
        cardCode: await this.printCardInfo(result.cardCode),
        accountNumber: result.accountNumber,
      };
    }
  }
  async printCardInfo(card: number) {
    const showNumbers = card;
    let hideNumbers = ' ';
    for (let i = String(showNumbers).length - 5; i >= 0; i -= 1) {
      hideNumbers += '*';
    }
    const show = showNumbers % 10000;
    const creditInfo = hideNumbers + show;
    return creditInfo;
  }

  async getAllAccounts(data: getAllAccountsDto) {
    const query = await this.accountsRepository.createQueryBuilder();
    query.where('deleted=false');
    if (data.searchBy.cardCode) {
      query.andWhere('cardCode like :AccountCardCode', {
        AccountCardCode: `%${this.escapeLikeString(data.searchBy.cardCode)}%`,
      });
    } else if (data.searchBy.accountNumber) {
      query.andWhere('accountNumber like : accountNumber', {
        accountNumber: `%${this.escapeLikeString(
          data.searchBy.accountNumber,
        )}%`,
      });
    } else if (data.searchBy.userId) {
      query.andWhere('userId like :UserId', {
        UserId: `${data.searchBy.userId}`,
      });
    }

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 25;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getMany();
    if (result) {
      return result.map((account) => ({
        id: account.id,
        account: account.accountNumber,
        carCode: this.printCardInfo(account.cardCode),
        balance: account.balance,
        userId: account.user,
      }));
    } else {
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }
  async deleteAccount(id: number) {
    await this.accountsRepository.save({
      id,
      deleted: true,
    });
    const deleted = await this.accountsRepository.findOne(id);
    if (deleted) {
      return {
        id: deleted.id,
        account: deleted.accountNumber,
        carcode: this.printCardInfo(deleted.cardCode),
        balance: deleted.balance,
        userId: deleted.user,
      };
    } else {
      return null;
    }
  }

  async updateAccount(id: number, data: accountInterface) {
    await this.accountsRepository.save({
      id,
      ...data,
    });
    const updated = await this.accountsRepository.findOne({ id });
    if (updated) {
      return {
        id: updated.id,
        user: updated.user,
        company: updated.company,
        balance: updated.balance,
        carCode: await this.printCardInfo(updated.cardCode),
        accountNumber: updated.accountNumber,
      };
    } else {
      return false;
    }
  }
}
