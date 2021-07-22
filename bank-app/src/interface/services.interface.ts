import { AccountEntity } from 'src/entities/account.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { Type } from 'src/enums/services-type.enum';

export class servicesInterface {
  id: number;
  userId: number;
  accountId: number;
  description: string;
  price: number;
  type: Type;
  deleted: boolean;
}
