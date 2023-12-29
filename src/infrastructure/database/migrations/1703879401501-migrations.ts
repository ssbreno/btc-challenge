import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1703879401501 implements MigrationInterface {
  name = 'Migrations1703879401501'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "btc_balance" numeric(18,8)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "btc_balance"`)
  }
}
