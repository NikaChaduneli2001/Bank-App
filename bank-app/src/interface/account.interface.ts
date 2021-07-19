import { UsersEntity } from 'src/entities/users.entity';

export class accountInterface {
  id: number;
  userId: number | UsersEntity;
  balance: number;
  accountNumber: string;
  cardCode: number;
  deleted: boolean;
}
