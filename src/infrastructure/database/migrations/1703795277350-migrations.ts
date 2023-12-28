import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1703795277350 implements MigrationInterface {
    name = 'Migrations1703795277350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "btc_amount" TYPE numeric(18,8)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "btc_amount" TYPE numeric(10,2)`);
    }

}
