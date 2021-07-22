import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createAccountDto } from 'src/dto/create-accounts.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsMysqlService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async createAccount(data: createAccountDto) {
    const newAccount: AccountEntity = new AccountEntity();
    newAccount.user = data.userId;
    newAccount.company = data.companyId;
    newAccount.balance = data.balance;
    newAccount.cardCode = data.cardCode;
    newAccount.accountNumber = data.accountNumber;
    newAccount.deleted = false;
    const result = await this.accountsRepository.save(newAccount);
    return {
      id: result.id,
      companyId: result.company,
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
}
