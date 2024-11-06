import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserCreationDate1730904797095 implements MigrationInterface {
    name = 'AddUserCreationDate1730904797095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "creation_date" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
