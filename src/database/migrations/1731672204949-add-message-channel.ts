import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageChannel1731672204949 implements MigrationInterface {
    name = 'AddMessageChannel1731672204949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "channel" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "channel"`);
    }

}
