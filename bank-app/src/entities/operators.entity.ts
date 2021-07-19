import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('operators')
@Unique(['email', 'personalNumber'])
export class OperatorsEntity {
  @PrimaryGeneratedColumn()
  id: number;
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
