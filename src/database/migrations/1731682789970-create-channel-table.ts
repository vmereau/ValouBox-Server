import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChannelTable1731682789970 implements MigrationInterface {
    name = 'CreateChannelTable1731682789970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel" ("id" SERIAL NOT NULL, "name" text, "creation_date" TIMESTAMP NOT NULL DEFAULT now(), "creator_id" integer, CONSTRAINT "PK_channel" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD "channel_id" integer`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_channel_creator" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_message_channel" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
