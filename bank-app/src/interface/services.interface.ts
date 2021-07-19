import { AccountEntity } from 'src/entities/account.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { Type } from 'src/enums/services-type.enum';

export class servicesInterface {
  id: number;
  userId: number | UsersEntity;
  accountId: number | AccountEntity;
  name: string;
  price: number;
  type: Type;
  deleted: boolean;
}
