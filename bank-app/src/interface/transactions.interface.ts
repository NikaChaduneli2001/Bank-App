import { AccountEntity } from 'src/entities/account.entity';
import { ServicesEntity } from 'src/entities/services.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { transactionType } from 'src/enums/transaction-type.enum';

export class transactionInterface {
  id: number;
  userId: number;
  accountId: number;
  serviceId: number;
  time: string;
  balance: number;
  role: string;
  description: string;
  deleted: boolean;
}
