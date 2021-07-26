import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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
  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;
  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
