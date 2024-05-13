import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1715620938454 implements MigrationInterface {
    name = 'Migration1715620938454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."lecture_lecture_type_enum" RENAME TO "lecture_lecture_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."lecture_lecture_type_enum" AS ENUM('VIDEO', 'EXAM', 'DOCUMENT')`);
        await queryRunner.query(`ALTER TABLE "lecture" ALTER COLUMN "lecture_type" TYPE "public"."lecture_lecture_type_enum" USING "lecture_type"::"text"::"public"."lecture_lecture_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lecture_lecture_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lecture_lecture_type_enum_old" AS ENUM('VIDEO', 'EXAM')`);
        await queryRunner.query(`ALTER TABLE "lecture" ALTER COLUMN "lecture_type" TYPE "public"."lecture_lecture_type_enum_old" USING "lecture_type"::"text"::"public"."lecture_lecture_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."lecture_lecture_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."lecture_lecture_type_enum_old" RENAME TO "lecture_lecture_type_enum"`);
    }

}
