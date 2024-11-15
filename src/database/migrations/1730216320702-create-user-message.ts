import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserMessage1730216320702 implements MigrationInterface {
    name = 'CreateUserMessage1730216320702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" text, CONSTRAINT "PK_user" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" text, "creation_date" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" integer, CONSTRAINT "PK_message" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_message_sender" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
