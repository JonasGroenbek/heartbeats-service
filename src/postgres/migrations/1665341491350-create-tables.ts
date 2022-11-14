import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTables1665341491350 implements MigrationInterface {
  name = 'createTables1665341491350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "heartbeat" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying NOT NULL, "group" character varying, "meta" jsonb, CONSTRAINT "PK_2eef6ae1f091f9a8900f60682fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group" character varying NOT NULL, "meta" jsonb, CONSTRAINT "PK_58b8339f1dc66a375fbc1943e61" PRIMARY KEY ("group"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "heartbeat" ADD CONSTRAINT "FK_ca424eed8c4b19dc15f1b3ca986" FOREIGN KEY ("group") REFERENCES "group"("group") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "heartbeat" DROP CONSTRAINT "FK_ca424eed8c4b19dc15f1b3ca986"`,
    );
    await queryRunner.query(`DROP TABLE "group"`);
    await queryRunner.query(`DROP TABLE "heartbeat"`);
  }
}
