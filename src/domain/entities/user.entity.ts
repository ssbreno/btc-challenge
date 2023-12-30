import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm'
import { Account } from './account.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column('varchar', { length: 250 })
  name?: string

  @Column('varchar', { length: 100, unique: true })
  email?: string

  @Column('varchar')
  password?: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @OneToOne(() => Account, (account) => account.user)
  account?: Account
}
