import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class History {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    buyPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    sellPrice: number;
}
