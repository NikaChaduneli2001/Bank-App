export class TransactionInterface {
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
