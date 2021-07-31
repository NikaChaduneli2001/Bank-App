import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('company')
@Unique(['email'])
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 100,
  })
  companyName: string;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  user: number | UsersEntity;
  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;
  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
