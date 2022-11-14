import { Group } from '../../group/group.entity';
import { Heartbeat } from '../../heartbeat/heartbeat.entity';
import { QueryRunner } from 'typeorm';

export const TEST_GROUPS_SEED: Partial<Group>[] = [
  { group: 'TEST_GROUP1' },
  { group: 'TEST_GROUP2' },
];

export const TEST_HEARTBEATS_SEED: Partial<Heartbeat>[] = [
  { group: 'TEST_GROUP1', id: 'TEST_HEARTBEAT1' },
  { group: 'TEST_GROUP1', id: 'TEST_HEARTBEAT2' },
  { group: 'TEST_GROUP1', id: 'TEST_HEARTBEAT3' },
  { group: 'TEST_GROUP2', id: 'TEST_HEARTBEAT4' },
  { group: 'TEST_GROUP2', id: 'TEST_HEARTBEAT5' },
  { group: 'TEST_GROUP2', id: 'TEST_HEARTBEAT6' },
];

export async function seedTestData(queryRunner: QueryRunner) {
  await clearTestData(queryRunner);

  const groupRepository = queryRunner.manager.getRepository(Group);
  await groupRepository.save(TEST_GROUPS_SEED);

  const heartbeatRepository = queryRunner.manager.getRepository(Heartbeat);
  await heartbeatRepository.save(TEST_HEARTBEATS_SEED);
}

export async function clearTestData(queryRunner: QueryRunner) {
  await queryRunner.manager
    .getRepository(Heartbeat)
    .createQueryBuilder()
    .delete()
    .where('1 = 1')
    .execute();

  await queryRunner.manager
    .getRepository(Group)
    .createQueryBuilder()
    .delete()
    .where('1 = 1')
    .execute();
}

export const TEST_DATA = {
  heartbeats: TEST_HEARTBEATS_SEED,
  groups: TEST_GROUPS_SEED,
};
