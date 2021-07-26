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
@Unique(['accountNumber', 'cardCode'])
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  user: number | UsersEntity;
  @ManyToOne(() => CompanyEntity, (company) => company.id, { eager: true })
  company: number | CompanyEntity;
  @Column('float')
  balance: number;
  @Column({
    type: 'varchar',
    length: 22,
  })
  accountNumber: string;
  @Column({
    type: 'float',
  })
  cardCode: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
