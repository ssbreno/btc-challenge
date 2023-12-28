import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { TransactionTypeEnum } from '../enums/transaction-type.enum'
import { Account } from './account.entity'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToOne(() => Account, (account) => account.transactions)
  account?: Account

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
    nullable: true,
  })
  type?: TransactionTypeEnum

  @Column('decimal', { precision: 10, scale: 2 })
  amount?: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  btcAmount?: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  btcPriceAtTransaction?: number

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
