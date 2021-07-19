import { AccountEntity } from 'src/entities/account.entity';
import { ServicesEntity } from 'src/entities/services.entity';
import { UsersEntity } from 'src/entities/users.entity';

export class transactionInterface {
  id: number;
  userId: number | UsersEntity;
  accountId: number | AccountEntity;
  serviceId: number | ServicesEntity;
  time: string;
  balance: number;
  deleted: boolean;
}
