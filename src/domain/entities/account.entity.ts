import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Transaction } from './transactions.entity'

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance?: number

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  btcBalance?: number

  @Column('varchar', { unique: true })
  accountNumber?: string

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user?: User

  @OneToMany(() => Transaction, (transactions) => transactions.account)
  transactions?: Transaction[]
}
