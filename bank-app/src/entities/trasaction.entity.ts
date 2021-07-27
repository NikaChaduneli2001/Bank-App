import { TransactionStatus } from 'src/enums/transaction-status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ServicesEntity } from './services.entity';
import { UsersEntity } from './users.entity';
@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: number | UsersEntity;
  @ManyToOne(() => AccountEntity, (account) => account.id, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: number | AccountEntity;
  @ManyToOne(() => AccountEntity, (account) => account.id, { eager: true })
  @JoinColumn({ name: 'receiverId' })
  receiver: number | AccountEntity;
  @ManyToOne(() => ServicesEntity, (service) => service.id, { eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: number | ServicesEntity;
  @Column('datetime', { nullable: false })
  time: Date;
  @Column('float')
  balance: number;
  @Column({
    type: 'varchar',
    length: 500,
  })
  description: string;
  @Column('enum', { enum: TransactionStatus, nullable: false })
  status: TransactionStatus;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
