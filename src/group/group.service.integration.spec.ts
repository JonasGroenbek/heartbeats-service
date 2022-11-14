import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupService } from './group.service';
import testTypeormConfig from '../postgres/typeorm-test.config';
import { seedTestData, TEST_DATA } from '../postgres/seeds/test-data.seed';

describe('group.service.ts', () => {
  let groupService: GroupService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeormConfig),
        TypeOrmModule.forFeature([Group]),
      ],
      providers: [GroupService],
    }).compile();

    groupService = app.get<GroupService>(GroupService);
  });

  it('GroupService is defined"', () => {
    expect(groupService).toBeDefined();
  });

  describe('getOne()', () => {
    beforeAll(async () => {
      const queryRunner =
        groupService.groupRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should throw error when attempting to retrieve not', async () => {
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const group = await groupService.getOne('NOT_EXISTING', queryRunner);
        await expect(group).toBeNull();
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('should retrieve an entity', async () => {
      const subject = TEST_DATA.groups[0];
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const group = await groupService.getOne(subject.group, queryRunner);

        expect(group).toBeDefined();
        expect(group.group).toEqual(subject.group);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('create()', () => {
    beforeAll(async () => {
      const queryRunner =
        groupService.groupRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should create an entity', async () => {
      const subject = { group: 'TEST_GROUP_CREATE' };
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        await groupService.create(subject.group, queryRunner);

        const group = await groupService.getOne(subject.group, queryRunner);
        expect(group).toBeDefined();
        expect(group.group).toEqual(subject.group);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('delete()', () => {
    beforeAll(async () => {
      const queryRunner =
        groupService.groupRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should delete the first entity in seed', async () => {
      const subjectGroup = TEST_DATA.groups[0].group;

      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const group = await groupService.getOne(subjectGroup, queryRunner);

        expect(group).toBeDefined();

        await groupService.delete(subjectGroup, queryRunner);

        const heartbeat = await groupService.getOne(subjectGroup, queryRunner);

        await expect(heartbeat).toBeNull();
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('getMany()', () => {
    beforeAll(async () => {
      const queryRunner =
        groupService.groupRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('returns all when retrieving all', async () => {
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const groups = await groupService.getMany({}, queryRunner);

        expect(groups.length).toEqual(TEST_DATA.groups.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('retrieves correct count when calling with withHeartbeatCount', async () => {
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const groups = await groupService.getMany(
          { withHeartbeatCount: true },
          queryRunner,
        );

        expect(groups.length).toEqual(TEST_DATA.groups.length);

        for (const group of groups) {
          const amountOfHeartbeats = TEST_DATA.heartbeats.filter(
            (heartbeat) => heartbeat.group === group.group,
          ).length;

          expect(amountOfHeartbeats).toEqual(group.instances);
        }
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('retrieves 2 when limits to 2', async () => {
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const { entities, count } = await groupService.getManyWithCount(
          { limit: 2 },
          queryRunner,
        );
        expect(entities.length).toEqual(2);
        expect(count).toEqual(TEST_DATA.groups.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('getManyAndCount()', () => {
    beforeAll(async () => {
      const queryRunner =
        groupService.groupRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('returns all when retrieving all and count is correct', async () => {
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const { entities, count } = await groupService.getManyWithCount(
          {},
          queryRunner,
        );

        expect(entities.length).toEqual(TEST_DATA.groups.length);
        expect(count).toEqual(TEST_DATA.groups.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('get all entities with limit and correct amount', async () => {
      const queryRunner =
        await groupService.groupRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const { entities, count } = await groupService.getManyWithCount(
          { limit: 2 },
          queryRunner,
        );
        expect(entities.length).toEqual(2);
        expect(count).toEqual(TEST_DATA.groups.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });
});
