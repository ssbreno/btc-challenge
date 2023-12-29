import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1703876490939 implements MigrationInterface {
  name = 'Migrations1703876490939'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('BUY', 'DEPOSIT', 'SELL', 'PARCIAL_SELL', 'WITHDRAW')`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('BUY', 'DEPOSIT', 'SELL', 'PARCIAL_SELL')`,
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
