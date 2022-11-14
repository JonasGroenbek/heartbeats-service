import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedGroups1665415069652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into "group" ("group", created_at, last_updated_at)
      values
      ('particle-detector', now(), now()),
      ('radio-receiver', now(), now()),
      ('temperature-transmitter', now(), now());`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return null;
  }
}
