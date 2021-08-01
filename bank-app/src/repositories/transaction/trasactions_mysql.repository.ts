import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { fillBlanaceDto } from 'src/dto/fill-balance.dto';
import { getAllTransactiosDto } from 'src/dto/get-all-transactios.dto';
import { AccountEntity } from 'src/entities/account.entity';
import { TransactionEntity } from 'src/entities/trasaction.entity';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionInterface } from 'src/interface/transactions.interface';
import { getSuccessMessage } from 'src/utils/response-functions.utils';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionMysqlService {
  private readonly logger = new Logger(TransactionMysqlService.name);
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  async transactionBelongsToUser(transactionId: number, userId: number) {
    this.logger.log(
      `belongs to user, userId: ${JSON.stringify(
        userId,
      )} and transactionId: ${JSON.stringify(transactionId)}`,
    );
    const belongs = await this.transactionsRepository
      .createQueryBuilder()
      .where('deleted=false')
      .andWhere('id=:transactionId', { id: transactionId })
      .andWhere('userId:userId', { userId })
      .getCount();
    this.logger.log(`belongs :${JSON.stringify(belongs)}`);
    if (belongs > 0) {
      this.logger.error(
        `coy belongs to  with given transactionId: ${JSON.stringify(
          transactionId,
        )} and userId: ${JSON.stringify(userId)}`,
      );
      return false;
    } else {
      return true;
    }
  }

  async createTrnasaction(
    data: createTransactionDto,
    sameOwner: boolean,
  ): Promise<TransactionInterface> {
    this.logger.log(
      `create transactions with given params , data: ${JSON.stringify(
        data,
      )} and sameOwner: ${JSON.stringify(sameOwner)}`,
    );
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
    this.logger.log(`created transaction , result:${JSON.stringify(result)}`);
    if (!result) {
      this.logger.error(
        `created transactions not found with given params, data: ${JSON.stringify(
          data,
        )} and sameOwner : ${JSON.stringify(sameOwner)}`,
      );
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
    this.logger.log(
      `transactions between users , transaction interface :${JSON.stringify(
        transaction,
      )}`,
    );
    if (transaction.status === TransactionStatus.pending) {
      return getSuccessMessage('Need Confirm');
    }
    this.logger.log(
      `transctions status : ${JSON.stringify(transaction.status)}`,
    );

    const userBalance = await this.accountsRepository.findOne(
      transaction.senderId,
    );

    this.logger.log(`find user balance : ${JSON.stringify(userBalance)}`);
    const newBalanceUser =
      Number(userBalance.balance) - Number(transaction.balance);
    this.logger.log(`users new balance : ${JSON.stringify(newBalanceUser)}`);
    if (newBalanceUser < 0) {
      return getSuccessMessage('No Money');
    }
    await this.accountsRepository.update(transaction.senderId, {
      balance: newBalanceUser,
    });

    const receiverBalance = await this.accountsRepository.findOne(
      transaction.receiverId,
    );
    this.logger.log(`receiver balance : ${JSON.stringify(receiverBalance)}`);
    const newBalanceReceiver =
      Number(receiverBalance.balance) + Number(transaction.balance);
    this.logger.log(
      `receiver new blanace : ${JSON.stringify(newBalanceReceiver)}`,
    );
    await this.accountsRepository.update(transaction.receiverId, {
      balance: newBalanceReceiver,
    });

    return getSuccessMessage('Transaction Succesfully');
  }

  async fillBalance(result: fillBlanaceDto): Promise<boolean> {
    this.logger.log(`fill balance Dto result : ${JSON.stringify(result)}`);
    const findAccount = await this.accountsRepository.findOne(
      result.receiverId,
    );
    this.logger.log(`find account : ${JSON.stringify(findAccount)}`);

    const newBalance = Number(findAccount.balance) + Number(result.amount);
    this.logger.log(`new balance : ${JSON.stringify(newBalance)}`);
    if (newBalance < 0) {
      this.logger.error(
        `fill balance , new balance not found : ${JSON.stringify(
          newBalance,
        )} with Dto :${JSON.stringify(result)}`,
      );
      return false;
    } else {
      await this.accountsRepository.update(result.receiverId, {
        balance: newBalance,
      });
      return true;
    }
  }

  async sameOwner(idOne: number, idTwo: number): Promise<boolean> {
    this.logger.log(
      `someOwner idOne:${JSON.stringify(idOne)} idTwo:${JSON.stringify(idTwo)}`,
    );
    const accountOne = await this.accountsRepository.findOne(idOne);
    this.logger.log(`account One : ${JSON.stringify(accountOne)}`);
    const accountTwo = await this.accountsRepository.findOne(idTwo);
    this.logger.log(`account One : ${JSON.stringify(accountTwo)}`);
    const userOne = accountOne.user;
    const userTwo = accountTwo.user;

    if (userOne === userTwo) {
      return true;
    } else {
      this.logger.error(
        `userOne: ${JSON.stringify(
          userOne,
        )} not equal to userTwo : ${JSON.stringify(userTwo)}`,
      );
      return false;
    }
  }

  async getAllTransactios(data: getAllTransactiosDto) {
    this.logger.log(
      `get all transactionsRepository data: ${JSON.stringify(data)}`,
    );
    const query = this.transactionsRepository.createQueryBuilder('transaction');
    query.leftJoinAndSelect('transaction.senderIdt', 'sender');
    query.leftJoinAndSelect('transaction.recieverIdt', 'receiver');
    query.leftJoinAndSelect('receiver.user', 'reciever');
    query.leftJoinAndSelect('sender.user', 'sender');
    query.where('transaction.delete=false');
    this.logger.log(`get all transactions query: ${JSON.stringify(query)}`);
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
    this.logger.log(`get all transactions result : ${JSON.stringify(result)}`);
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
      this.logger.error(
        `transactions not found with given  params: ${JSON.stringify(data)}`,
      );
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }

  async getSendersTransactionsWithSenderId(senderId: number) {
    this.logger.log(`sender id : ${JSON.stringify(senderId)}`);
    const findSenderTransaction = await this.transactionsRepository.find({
      id: senderId,
    });
    this.logger.log(
      `find senders transaction : ${JSON.stringify(findSenderTransaction)}`,
    );
    if (!findSenderTransaction) {
      this.logger.error(
        `could not find senders transactions with given id : ${JSON.stringify(
          senderId,
        )}`,
      );
      return false;
    }
    const queryBuilder = this.transactionsRepository.createQueryBuilder();
    queryBuilder.leftJoinAndSelect('senderId', 'sender');
    queryBuilder.leftJoinAndSelect('sender.user', 'sender');
    queryBuilder.where('deleted=false');
    this.logger.log(
      `senders transactions query: ${JSON.stringify(queryBuilder)}`,
    );
    const result = await queryBuilder.getRawMany();
    this.logger.log(
      `get senders transactions , result: ${JSON.stringify(result)}`,
    );
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
    }));
  }

  async deleteTransactions(id: number) {
    this.logger.log(`deleting transactions with id ${JSON.stringify(id)}`);
    const findTransactions = await this.transactionsRepository.findOne({ id });
    this.logger.log(`find transactions ${JSON.stringify(findTransactions)}`);
    if (findTransactions.status === TransactionStatus.canceled) {
      this.logger.log(
        `find transactions status ${JSON.stringify(findTransactions.status)}`,
      );
      await this.transactionsRepository.save({
        id,
        delete: true,
      });
    }
    const deleted = await this.transactionsRepository.findOne({
      id,
    });
    this.logger.log(`deleted transaction : ${JSON.stringify(deleted)}`);
    if (!deleted) {
      this.logger.error(
        `could not found deleted transactions with given id : ${JSON.stringify(
          id,
        )}`,
      );
      return false;
    } else {
      return {
        id: deleted.id,
        sender: deleted.sender,
        receiver: deleted.receiver,
        time: deleted.time,
        status: deleted.status,
        type: deleted.type,
      };
    }
  }

  async updateTransactionStatus(id: number, status: TransactionStatus) {
    this.logger.log(
      `updateing status id : ${JSON.stringify(id)} and status :${JSON.stringify(
        status,
      )}`,
    );
    const updateStatus = await this.transactionsRepository.save({
      id,
      status,
    });
    this.logger.log(`updated status : ${JSON.stringify(updateStatus)}`);
    if (!updateStatus) {
      this.logger.log(
        `updated status not found with given id : ${JSON.stringify(
          id,
        )} and status : ${JSON.stringify(status)}`,
      );
      return false;
    }
    const queryBuilder =
      this.transactionsRepository.createQueryBuilder('transaction');
    queryBuilder.leftJoinAndSelect('transaction.senderId', 'sender');
    queryBuilder.leftJoinAndSelect('transaction.recieverId', 'receiver');
    queryBuilder.leftJoinAndSelect('receiver.user', 'reciever');
    queryBuilder.leftJoinAndSelect('sender.user', 'sender');
    queryBuilder.where('transaction.id = :id', { id });
    this.logger.log(
      `updated status query builder : ${JSON.stringify(queryBuilder)}`,
    );
    const result = await queryBuilder.getRawMany();
    this.logger.log(`updated status result : ${JSON.stringify(result)}`);

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

  async updateTransaction(id: number, update: TransactionInterface) {
    this.logger.log(
      `updated transaction ${JSON.stringify(
        id,
      )} and transactions Interface:${JSON.stringify(update)}`,
    );
    await this.transactionsRepository.save({
      id,
      ...update,
    });

    const updated = await this.transactionsRepository.findOne({ id });
    this.logger.log(`updated transaction: ${JSON.stringify(updated)}`);
    if (!updated) {
      this.logger.error(
        `could not found updated transaction, with given params , id: ${JSON.stringify(
          id,
        )} and data: ${JSON.stringify(update)}`,
      );
      return false;
    } else {
      return {
        id: updated.id,
        receiver: updated.receiver,
        sender: updated.sender,
        type: updated.type,
        time: updated.time,
      };
    }
  }

  async transferIntoAccount(transfer: fillBlanaceDto) {
    this.logger.log(
      `transfer into account , fill balance Dto: ${JSON.stringify(transfer)}`,
    );
    const newTransaction = new TransactionEntity();
    const balance = Math.abs(transfer.amount);
    newTransaction.time = new Date();
    newTransaction.type = transfer.type;
    newTransaction.status = TransactionStatus.sent;
    newTransaction.balance = balance;
    newTransaction.sender = transfer.receiverId;
    newTransaction.receiver = transfer.receiverId;
    const createdTransaction = await this.transactionsRepository.save(
      newTransaction,
    );
    this.logger.log(
      `created transactions : ${JSON.stringify(createdTransaction)}`,
    );
    if (!createdTransaction) {
      this.logger.error(
        `could not found created transaction with given param , :${JSON.stringify(
          transfer,
        )}`,
      );
      return false;
    } else {
      return {
        id: createdTransaction.id,
        time: createdTransaction.time,
        type: createdTransaction.type,
        status: createdTransaction.status,
        amount: createdTransaction.balance,
        sender: createdTransaction.sender,
        receiver: createdTransaction.receiver,
      };
    }
  }
}
