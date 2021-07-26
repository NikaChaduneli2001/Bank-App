import { Type } from '@nestjs/common';

export class ServicesInterface {
  id: number;
  userId: number;
  accountId: number;
  description: string;
  price: number;
  type: Type;
  deleted: boolean;
}
