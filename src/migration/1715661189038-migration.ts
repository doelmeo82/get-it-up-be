import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715661189038 implements MigrationInterface {
    name = 'Migration1715661189038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "last_login" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_login"`);
    }

}
