import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { UsersEntity } from './users.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  @Unique(['accountNumber', 'cardCode'])
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: number | UsersEntity;
  @ManyToOne(() => CompanyEntity, (company) => company.id, { eager: true })
  @JoinColumn({ name: 'companyId' })
  company: number | CompanyEntity;
  @Column('float')
  balance: number;
  @Column({
    type: 'varchar',
    length: 22,
  })
  accountNumber: string;
  @Column({
    type: 'int',
    length: 16,
  })
  cardCode: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}