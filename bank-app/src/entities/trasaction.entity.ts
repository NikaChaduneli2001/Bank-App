import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { ServicesEntity } from './services.entity';
import { UsersEntity } from './users.entity';

export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: number | UsersEntity;
  @ManyToOne(() => AccountEntity, (account) => account.id, { eager: true })
  @JoinColumn({ name: 'accountId' })
  account: number | AccountEntity;
  @ManyToOne(() => ServicesEntity, (service) => service.id, { eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: number | ServicesEntity;
  @Column('datetime')
  time: string;
  @Column('float')
  balance: number;
  @Column({
    type: 'varchar',
    length: 500,
  })
  description: string;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
