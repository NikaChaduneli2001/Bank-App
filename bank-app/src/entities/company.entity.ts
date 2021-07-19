import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  @Unique(['email', 'personalNumber', 'cardCode'])
  id: number;
  @Column({
    type: 'varchar',
    length: 100,
  })
  comanyName: string;
  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;
  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;
  @Column({
    type: 'int',
    length: 11,
  })
  personalNumber: number;
}
