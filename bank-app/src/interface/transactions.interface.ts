import { TransactionStatus } from 'src/enums/transaction-status.enum';

export class TransactionInterface {
  id: number;
  senderId?: number;
  receiverId?: number;
  serviceId: number;
  time?: Date;
  balance: number;
  status?: TransactionStatus;
  description: string;
}
