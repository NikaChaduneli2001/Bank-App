import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { fillBlanaceDto } from 'src/dto/fill-balance.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { TransactionEntity } from 'src/entities/trasaction.entity';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionInterface } from 'src/interface/transactions.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionMysqlService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async createTrnasaction(
    data: createTransactionDto,
    sameOwner: boolean,
  ): Promise<TransactionInterface> {
    const transaction = new TransactionEntity();
    transaction.sender = data.senderId;
    transaction.receiver = data.receiverId;
    transaction.description = data.description;
    if (data.balance > 10) {
      transaction.balance = data.balance;
    }
    if (data.serviceId) {
      transaction.service = data.serviceId;
    }
    transaction.time = new Date();
    transaction.type = data.type;
    if (data.balance > 5000 && !sameOwner) {
      transaction.status = TransactionStatus.pending;
    } else {
      transaction.status = TransactionStatus.sent;
    }
    transaction.deleted = false;
    const result = await this.transactionsRepository.save(transaction);
    if (!result) {
      return null;
    } else {
      return {
        id: result.id,
        senderId: Number(result.sender),
        receiverId: Number(result.receiver),
        description: result.description,
        balance: result.balance,
        serviceId: Number(result.service),
        time: result.time,
        status: result.status,
      };
    }
  }

  async transactionsBetweenUsers(transaction: TransactionInterface) {
    if (transaction.status === TransactionStatus.pending) {
      return getSuccessMessage('Need Confirm');
    }

    const senderUser = Number(transaction.senderId);
    const userBalance = await this.accountsRepository.findOne(senderUser);
    const newBalanceUser =
      Number(userBalance.balance) - Number(transaction.balance);
    if (newBalanceUser < 0) {
      return getSuccessMessage('No Money');
    }
    await this.accountsRepository.update(transaction.senderId, {
      balance: newBalanceUser,
    });

    const receiverUser = Number(transaction.receiverId);
    const receiverBalance = await this.accountsRepository.findOne(receiverUser);
    const newBalanceReceiver =
      Number(receiverBalance.balance) + Number(transaction.balance);
    await this.accountsRepository.update(transaction.receiverId, {
      balance: newBalanceReceiver,
    });

    return getSuccessMessage('Transaction Succes');
  }

  async fillBalanace(result: fillBlanaceDto): Promise<boolean> {
    const findAccount = await this.accountsRepository.findOne(
      result.receiverId,
    );

    const newBalance = Number(findAccount.balance) + Number(result.amount);
    if (newBalance < 0) {
      return false;
    } else {
      await this.accountsRepository.update(result.receiverId, {
        balance: newBalance,
      });
      return true;
    }
  }

  async sameOwner(idOne: number, idTwo: number): Promise<boolean> {
    const accountOne = await this.accountsRepository.findOne(idOne);
    const accountTwo = await this.accountsRepository.findOne(idTwo);
    const userOne = accountOne.user;
    const userTwo = accountTwo.user;

    if (userOne === userTwo) {
      return true;
    } else {
      return false;
    }
  }
}
