import { Role } from 'src/enums/role.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('users')
@Unique(['email', 'personalNumber'])
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => CompanyEntity, (comp) => comp.id)
  company: number | CompanyEntity;
  @Column('varchar', {
    length: 100,
  })
  fullName: string;
  @Column('varchar', {
    length: 100,
  })
  email: string;
  @Column('datetime')
  time: string;
  @Column('varchar', {
    length: 250,
  })
  hash: string;
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
  @Column('int')
  phone: number;
  @Column({
    type: 'varchar',
    length: 11,
  })
  personalNumber: string;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
