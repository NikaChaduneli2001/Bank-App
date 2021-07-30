import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { getAllAccountsDto } from 'src/dto/get-all.accounts.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountInterface } from 'src/interface/account.interface';
import { UsersInterface } from 'src/interface/users.interface';
import { Repository } from 'typeorm';
import { runInThisContext } from 'vm';

@Injectable()
export class AccountsMysqlService {
  private readonly logger = new Logger(AccountsMysqlService.name);
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async createAccount(data: createAccountDto) {
    this.logger.log(`creating accounts data: ${data}`);
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
    this.logger.log(`created account result: ${result}`);
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
    this.logger.log(
      `account belongs to user , accountId: ${accountId}, userId: ${userId}`,
    );
    const result = await this.accountsRepository
      .createQueryBuilder()
      .where('id=:accountId', { accountId: accountId })
      .andWhere('userId=:userId', { userId })
      .getCount();
    this.logger.log(`belongs result : ${result}`);
    if (result > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getAllAccounts(data: getAllAccountsDto) {
    this.logger.log(`get all accounts data: ${data}`);
    const query = await this.accountsRepository.createQueryBuilder('account');
    this.logger.log(`queryBuilder query: ${query}`);
    query.leftJoinAndSelect('account.userId', 'user');
    query.leftJoinAndSelect('account.companyId', 'company');
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
    this.logger.log(`get all accounts result: ${result}`);
    if (result) {
      return result.map((acc) => ({
        id: acc.id,
        account: acc.accountNumber,
        cardCode: this.printCardInfo(acc.cardCode),
        balance: acc.balance,
        user: {
          fullName: acc.user.fullName,
          email: acc.user.email,
          role: acc.user.role,
        },
        company: {
          comanyName: acc.company.comanyName,
          email: acc.company.email,
        },
      }));
    } else {
      this.logger.error(`coud get accounts , data:${data}`);
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }
  async deleteAccount(id: number) {
    this.logger.log(`deleting account id: ${id}`);
    await this.accountsRepository.save({
      id,
      deleted: true,
    });
    const deleted = await this.accountsRepository.findOne(id);
    this.logger.log(`deleted account : ${deleted}`);
    if (deleted) {
      return {
        id: deleted.id,
        account: deleted.accountNumber,
        cardCode: this.printCardInfo(deleted.cardCode),
        balance: deleted.balance,
        userId: deleted.user,
      };
    } else {
      this.logger.error(
        `could not found deleted accounts with given id: ${id}`,
      );
      return null;
    }
  }

  async updateAccount(id: number, data: AccountInterface) {
    this.logger.log(`updating account ${id} and data: ${data}`);
    await this.accountsRepository.save({
      id,
      ...data,
    });
    const updated = await this.accountsRepository.findOne({ id });
    this.logger.log(`updated account ${updated}`);
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
      this.logger.error(
        `could not found updated account with given id:${id} and data: ${data}`,
      );
      return false;
    }
  }

  async getUsersAccount(userId: number) {
    this.logger.log(`get users account with userId :${userId}`);
    const result = this.accountsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('user', 'userId')
      .where('deleted=false')
      .andWhere('user=:userId', { user: userId })
      .getMany();
    this.logger.log(`get users account result : ${result}`);
    if (result) {
      return (await result).map((result) => ({
        id: result.id,
        balance: result.balance,
        cardCode: this.printCardInfo(result.cardCode),
        accountNumber: result.accountNumber,
        userId: result.user,
      }));
    } else {
      this.logger.error(
        `could not found users account with given userId: ${userId}`,
      );
      return false;
    }
  }

  async getCompanyAccount(companyId: number) {
    this.logger.log(`get users account with companyId :${companyId}`);
    const result = await this.accountsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('company', 'companyId')
      .where('deleted=false')
      .andWhere('company=:companyId', { companyId: companyId })
      .getMany();
    this.logger.log(`get company account result : ${result}`);
    if (result) {
      return await result.map((result) => ({
        id: result.id,
        balance: result.balance,
        cardCode: this.printCardInfo(result.cardCode),
        accountNumber: result.accountNumber,
        companyId: result.company,
      }));
    } else {
      this.logger.error(
        `could not found company account with given userId: ${companyId}`,
      );
      return false;
    }
  }
}
