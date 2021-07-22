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
      cardCode: await this.printCreditInfo(result.cardCode),
      accountNumber: result.accountNumber,
    };
  }
  async printCreditInfo(cardCode: number) {
    let string = '';
    let newStr = '';
    let showNumbers = cardCode % 10000;
    for (let i = 0; i < String(cardCode).length - 5; i++) {
      string += String(cardCode[i]);
    }
    for (let i = 0; i < string.length; i += 1) {
      newStr += '*';
    }
    const result = newStr + showNumbers;
    return result;
  }
}
