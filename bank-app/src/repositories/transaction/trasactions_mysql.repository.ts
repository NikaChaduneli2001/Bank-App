import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { createTransactionDto } from 'src/dto/create-transaction.dto';
import { TransactionEntity } from 'src/entities/trasaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionMysqlService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  async createTrnasaction(data: createTransactionDto) {
    const transaction = new TransactionEntity();
    transaction.sender = data.senderId;
    transaction.receiver = data.receiverId;
    transaction.description = data.description;
    if (data.balance > 55) {
      transaction.balance = data.balance;
    }
    if (data.serviceId) {
      transaction.service = data.serviceId;
    }
    transaction.time = new Date();
    transaction.status = data.status;

    const result = await this.transactionsRepository.save(transaction);
    if (!result) {
      return false;
    } else {
      return {
        id: result.id,
        sender: result.sender,
        receiver: result.receiver,
        description: result.description,
        balance: result.balance,
        service: result.service,
        time: result.time,
        status: result.status,
      };
    }
  }
}
