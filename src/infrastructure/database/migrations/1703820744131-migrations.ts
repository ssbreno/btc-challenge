import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1703820744131 implements MigrationInterface {
  name = 'Migrations1703820744131'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('BUY', 'DEPOSIT', 'SELL', 'PARCIAL_SELL')`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`)
    await queryRunner.query(
      `ALTER TABLE "history" ALTER COLUMN "buy_price" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "history" ALTER COLUMN "sell_price" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history" ALTER COLUMN "sell_price" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "history" ALTER COLUMN "buy_price" SET NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('BUY', 'DEPOSIT', 'SELL')`,
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
