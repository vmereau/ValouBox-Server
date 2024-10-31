import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPassword1730381010737 implements MigrationInterface {
    name = 'AddUserPassword1730381010737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
