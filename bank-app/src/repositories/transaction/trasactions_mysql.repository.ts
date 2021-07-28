import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { fillBlanaceDto } from 'src/dto/fill-balance.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
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

  async transactionBelongsToUser(transactionId: number, userId: number) {
    const belongs = await this.transactionsRepository
      .createQueryBuilder()
      .where('deleted=false')
      .andWhere('id=:transactionId', { id: transactionId })
      .andWhere('userId:userId', { userId })
      .getCount();
    if (belongs > 0) {
      return false;
    } else {
      return true;
    }
  }

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

    const userBalance = await this.accountsRepository.findOne(
      transaction.senderId,
    );
    const newBalanceUser =
      Number(userBalance.balance) - Number(transaction.balance);
    if (newBalanceUser < 0) {
      return getSuccessMessage('No Money');
    }
    await this.accountsRepository.update(transaction.senderId, {
      balance: newBalanceUser,
    });

    const receiverBalance = await this.accountsRepository.findOne(
      transaction.receiverId,
    );
    const newBalanceReceiver =
      Number(receiverBalance.balance) + Number(transaction.balance);
    await this.accountsRepository.update(transaction.receiverId, {
      balance: newBalanceReceiver,
    });

    return getSuccessMessage('Transaction Succesfully');
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

  async getAllTransactios(data: getAllTransactiosDto) {
    const query = this.transactionsRepository.createQueryBuilder('transaction');
    query.leftJoinAndSelect('transaction.senderIdt', 'sender');
    query.leftJoinAndSelect('transaction.recieverIdt', 'receiver');
    query.leftJoinAndSelect('receiver.user', 'reciever');
    query.leftJoinAndSelect('sender.user', 'sender');
    query.where('transaction.delete=false');
    if (data.searchBy) {
      if (data.searchBy.time) {
        query.andWhere('cardCode like :TransactiosTime', {
          TransactiosTime: `%${data.searchBy.time}%`,
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
    if (result) {
      return result.map((res) => ({
        id: res.transaction.id,
        sender: {
          fullName: res.sender.fullName,
          account: res.sender.account,
        },
        receiver: {
          fullName: res.receiver.fullName,
          account: res.receiver.account,
        },
        balance: res.transaction.balance,
        description: res.transaction.description,
        time: res.transaction.time,
        status: res.transaction.status,
        type: res.transaction.type,
      }));
    } else {
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }

  async deleteTransactions(id: number) {
    const findTransactions = await this.transactionsRepository.findOne({ id });
    if (findTransactions.status === TransactionStatus.canceled) {
      await this.transactionsRepository.save({
        id,
        delete: true,
      });
    }
    const deleted = await this.transactionsRepository.findOne({
      id,
    });
    if (!deleted) {
      return false;
    } else {
      return deleted;
    }
  }

  async updateTransactionStatus(id: number, status: TransactionStatus) {
    await this.transactionsRepository.save({
      id,
      status,
    });
    const queryBuilder =
      this.transactionsRepository.createQueryBuilder('transaction');
    queryBuilder.leftJoinAndSelect('transaction.senderId', 'sender');
    queryBuilder.leftJoinAndSelect('transaction.recieverId', 'receiver');
    queryBuilder.leftJoinAndSelect('receiver.user', 'reciever');
    queryBuilder.leftJoinAndSelect('sender.user', 'sender');
    queryBuilder.where('transaction.id = :id', { id });
    const result = await queryBuilder.getRawMany();

    return result.map((res) => ({
      moneyAmount: res.transaction.moneyAmount,
      transactuonDate: res.transaction.times,
      status: res.transaction.status,
      type: res.transaction.type,
      description: res.transaction.description,
      sender: {
        fullName: res.sender.fullName,
        account: res.sender.accountNumber,
      },
      reciever: {
        fullName: res.reciever.fullName,
        account: res.receiver.accountNumber,
      },
    }));
  }
}
