import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715422990110 implements MigrationInterface {
    name = 'Migration1715422990110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "payment_status" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "payment_status" SET DEFAULT false`);
    }

}
