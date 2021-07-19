import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @Unique(['email', 'personalNumber'])
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
