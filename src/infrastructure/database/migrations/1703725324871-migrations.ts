import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1703725324871 implements MigrationInterface {
  name = 'Migrations1703725324871'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('BUY', 'DEPOSIT', 'SELL')`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('DEBIT', 'WITHDRAW', 'CREDIT')`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum_old" USING "type"::"text"::"public"."transaction_type_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_type_enum_old" RENAME TO "transaction_type_enum"`,
    )
  }
}
