import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountInterface } from 'src/interface/account.interface';
import { UsersInterface } from 'src/interface/users.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsMysqlService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async createAccount(data: createAccountDto) {
    const newAccount: AccountEntity = new AccountEntity();
    if (data.user) {
      newAccount.user = data.user;
    }
    if (data.company) {
      newAccount.company = data.company;
    }
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

  async accountBelongsToUser(accountId: number, userId: number) {
    const result = await this.accountsRepository
      .createQueryBuilder()
      .where('id=:accountId', { accountId: accountId })
      .andWhere('userId=:userId', { userId })
      .getCount();
    if (result > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getAllAccounts(data: getAllAccountsDto) {
    const query = await this.accountsRepository.createQueryBuilder('account');
    query.where('account.deleted=false');
    if (data.searchBy) {
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
      } else if (data.searchBy.companyId) {
        query.andWhere('companyId like :CompanyId', {
          companyId: `${data.searchBy.companyId}`,
        });
      }
      if (data.searchBy.userId) {
        query.leftJoinAndSelect('account.userId', 'user');
        query.andWhere('user.deleted=false');
        query.select(['user.fullName', 'user.email', 'user.role']);
      } else if (data.searchBy.companyId) {
        query.leftJoinAndSelect('account.companyId', 'company');
        query.andWhere('company.deleted=false');
      }
    }

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 25;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(data.limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getRawMany();
    if (result) {
      return result.map((account) => ({
        id: account.id,
        account: account.accountNumber,
        cardCode: this.printCardInfo(account.cardCode),
        balance: account.balance,
        user: {
          fullName: account.user.fullName,
          email: account.user.email,
          role: account.user.role,
        },
        company: {
          comanyName: account.company.comanyName,
          email: account.company.email,
        },
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
        cardCode: this.printCardInfo(deleted.cardCode),
        balance: deleted.balance,
        userId: deleted.user,
      };
    } else {
      return null;
    }
  }

  async updateAccount(id: number, data: AccountInterface) {
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
        cardCode: await this.printCardInfo(updated.cardCode),
        accountNumber: updated.accountNumber,
      };
    } else {
      return false;
    }
  }

  async getUsersAccount(userId: number) {
    const result = this.accountsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('user', 'userId')
      .where('deleted=false')
      .andWhere('user=:userId', { user: userId })
      .getMany();
    if (result) {
      return (await result).map((result) => ({
        id: result.id,
        balance: result.balance,
        cardCode: this.printCardInfo(result.cardCode),
        accountNumber: result.accountNumber,
        userId: result.user,
      }));
    } else {
      return false;
    }
  }

  async getCompanyAccount(companyId: number) {
    const result = await this.accountsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('company', 'companyId')
      .where('deleted=false')
      .andWhere('company=:companyId', { companyId: companyId })
      .getMany();
    if (result) {
      return await result.map((result) => ({
        id: result.id,
        balance: result.balance,
        cardCode: this.printCardInfo(result.cardCode),
        accountNumber: result.accountNumber,
        companyId: result.company,
      }));
    } else {
      return false;
    }
  }
}
