import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715659822516 implements MigrationInterface {
    name = 'Migration1715659822516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subject" ("_id" SERIAL NOT NULL, "subject_name" character varying(255) NOT NULL, "include_courses" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ca5d4ef9f9901d3f03f0d0ae20" PRIMARY KEY ("_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subject"`);
    }

}
