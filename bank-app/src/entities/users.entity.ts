import { Role } from 'src/enums/role.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @Unique(['email', 'personalNumber'])
  id: number;
  @Column('varchar', {
    length: 100,
  })
  @ManyToOne(() => CompanyEntity, (comp) => comp.id)
  companyId: number | CompanyEntity;
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
  @Column('varchar')
  role: Role;
  @Column('int')
  phone: number;
  @Column({
    type: 'int',
    length: 11,
  })
  personalNumber: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
