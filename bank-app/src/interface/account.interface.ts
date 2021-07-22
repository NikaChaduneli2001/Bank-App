import { UsersEntity } from 'src/entities/users.entity';

export class accountInterface {
  id: number;
  userId: number;
  balance: number;
  accountNumber: string;
  cardCode: number;
  deleted: boolean;
}
