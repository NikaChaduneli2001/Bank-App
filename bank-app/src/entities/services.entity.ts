import { Type } from 'src/enums/services-type.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { UsersEntity } from './users.entity';

@Entity('services')
export class ServicesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: number | UsersEntity;
  @ManyToOne(() => AccountEntity, (account) => account.id, { eager: true })
  @JoinColumn({ name: 'accountId' })
  account: number | AccountEntity;
  @Column('varchar')
  description: string;
  @Column('float')
  price: number;
  @Column('varchar')
  type: Type;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
