import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeMetaColumnFromGorup1665695518648
  implements MigrationInterface
{
  name = 'removeMetaColumnFromGorup1665695518648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "meta"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "group" ADD "meta" jsonb`);
  }
}
