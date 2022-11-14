import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Heartbeat } from './heartbeat.entity';
import { HeartbeatService } from './heartbeat.service';
import testTypeormConfig from '../postgres/typeorm-test.config';
import { seedTestData, TEST_DATA } from '../postgres/seeds/test-data.seed';

describe('heartbeat.service.ts', () => {
  let heartbeatService: HeartbeatService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeormConfig),
        TypeOrmModule.forFeature([Heartbeat]),
      ],
      providers: [HeartbeatService],
    }).compile();

    heartbeatService = app.get<HeartbeatService>(HeartbeatService);
  });

  it('HeartbeatService is defined"', () => {
    expect(heartbeatService).toBeDefined();
  });

  describe('getOne()', () => {
    beforeAll(async () => {
      const queryRunner =
        heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should throw error when attempting to retrieve not', async () => {
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();
        const heartbeat = await heartbeatService.getOne(
          { id: 'NOT_EXISTING', group: 'NOT_EXISTING' },
          queryRunner,
        );
        await expect(heartbeat).toBeNull();
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('should retrieve an entity', async () => {
      const subject = TEST_DATA.heartbeats[0];
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const heartbeat = await heartbeatService.getOne(
          { id: subject.id, group: subject.group },
          queryRunner,
        );

        expect(heartbeat).toBeDefined();
        expect(heartbeat.group).toEqual(subject.group);
        expect(heartbeat.id).toEqual(subject.id);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('create()', () => {
    beforeAll(async () => {
      const queryRunner =
        heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should create an entity', async () => {
      const subject = { group: TEST_DATA.groups[0].group, id: 'TEST_ID' };
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        await heartbeatService.create(subject, queryRunner);

        const heartbeat = await heartbeatService.getOne(subject, queryRunner);
        expect(heartbeat).toBeDefined();
        expect(heartbeat.group).toEqual(subject.group);
        expect(heartbeat.id).toEqual(subject.id);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('delete()', () => {
    beforeAll(async () => {
      const queryRunner =
        heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should delete the first entity in seed', async () => {
      const subject = TEST_DATA.heartbeats[0];
      const identifiers = { group: subject.group, id: subject.id };
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const heartbeat = await heartbeatService.getOne(
          identifiers,
          queryRunner,
        );

        expect(heartbeat).toBeDefined();

        await heartbeatService.delete(identifiers, queryRunner);

        const expectedDeletedHeartbeat = await heartbeatService.getOne(
          identifiers,
          queryRunner,
        );
        await expect(expectedDeletedHeartbeat).toBeNull();
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('getMany()', () => {
    beforeAll(async () => {
      const queryRunner =
        heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('returns all when retrieving all', async () => {
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const heartbeats = await heartbeatService.getMany({}, queryRunner);

        expect(heartbeats.length).toEqual(TEST_DATA.heartbeats.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('retrieves 2 when limits to 2', async () => {
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const { entities, count } = await heartbeatService.getManyWithCount(
          { limit: 2 },
          queryRunner,
        );
        expect(entities.length).toEqual(2);
        expect(count).toEqual(TEST_DATA.heartbeats.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('getManyAndCount()', () => {
    beforeAll(async () => {
      const queryRunner =
        heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('returns all when retrieving all and count is correct', async () => {
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const { entities, count } = await heartbeatService.getManyWithCount(
          {},
          queryRunner,
        );

        expect(entities.length).toEqual(TEST_DATA.heartbeats.length);
        expect(count).toEqual(TEST_DATA.heartbeats.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('get all entities with limit and correct amount', async () => {
      const queryRunner =
        await heartbeatService.heartbeatRepository.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const { entities, count } = await heartbeatService.getManyWithCount(
          { limit: 2 },
          queryRunner,
        );
        expect(entities.length).toEqual(2);
        expect(count).toEqual(TEST_DATA.heartbeats.length);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });
});
