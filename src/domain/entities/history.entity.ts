import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  buyPrice: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sellPrice: number
}
