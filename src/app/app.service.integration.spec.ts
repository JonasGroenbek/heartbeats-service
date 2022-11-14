import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seedTestData, TEST_DATA } from '../postgres/seeds/test-data.seed';
import { GroupModule } from '../group/group.module';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';
import testTypeormConfig from '../postgres/typeorm-test.config';
import { AppService } from './app.service';

describe('app.service.ts', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeormConfig),
        HeartbeatModule,
        GroupModule,
      ],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  it('AppService is defined"', () => {
    expect(appService).toBeDefined();
  });

  describe('getGroups()', () => {
    beforeAll(async () => {
      const queryRunner =
        appService.datasource.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should return correct amounts with varying limit and offset', async () => {
      const queryRunner =
        await appService.datasource.manager.connection.createQueryRunner();

      let offset = 0;
      let limit = 0;
      let groups = [];
      try {
        await queryRunner.startTransaction();
        //limit = 0 should return all entities
        groups = await appService.getGroups({
          offset,
          limit,
          withHeartbeatCount: true,
        });
        expect(groups.length).toEqual(TEST_DATA.groups.length - offset);

        limit = 1;
        offset = 0;
        groups = await appService.getGroups({
          offset,
          limit,
          withHeartbeatCount: true,
        });
        expect(groups.length).toEqual(limit - offset);

        limit = TEST_DATA.groups.length;
        offset = 0;
        groups = await appService.getGroups({
          offset,
          limit,
          withHeartbeatCount: true,
        });
        expect(groups.length).toEqual(limit - offset);

        limit = TEST_DATA.groups.length;
        offset = 1;
        groups = await appService.getGroups({
          offset,
          limit,
          withHeartbeatCount: true,
        });
        expect(groups.length).toEqual(limit - offset);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('returns correct group with group filter', async () => {
      const queryRunner =
        await appService.datasource.manager.connection.createQueryRunner();

      const subject = TEST_DATA.groups[0];
      try {
        await queryRunner.startTransaction();
        const group = (
          await appService.getGroups(
            {
              limit: 1,
              offset: 0,
              group: subject.group,
            },
            queryRunner,
          )
        )[0];

        expect(subject.group).toEqual(group.group);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('getHeartbeats()', () => {
    beforeAll(async () => {
      const queryRunner =
        appService.datasource.manager.connection.createQueryRunner();

      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should return correct amounts with varying limit and offset', async () => {
      const queryRunner =
        await appService.datasource.manager.connection.createQueryRunner();

      let offset = 0;
      let limit = 0;
      let heartbeats = [];
      try {
        await queryRunner.startTransaction();
        //limit = 0 should return all entities
        heartbeats = await appService.getHeartbeats({
          offset,
          limit,
        });
        expect(heartbeats.length).toEqual(TEST_DATA.heartbeats.length - offset);

        limit = 1;
        offset = 0;
        heartbeats = await appService.getHeartbeats({
          offset,
          limit,
        });
        expect(heartbeats.length).toEqual(limit - offset);

        limit = TEST_DATA.groups.length;
        offset = 0;
        heartbeats = await appService.getHeartbeats({
          offset,
          limit,
        });
        expect(heartbeats.length).toEqual(limit - offset);

        limit = TEST_DATA.heartbeats.length;
        offset = 1;
        heartbeats = await appService.getHeartbeats({
          offset,
          limit,
        });
        expect(heartbeats.length).toEqual(limit - offset);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });

    it('returns correct group with group filter', async () => {
      const queryRunner =
        await appService.datasource.manager.connection.createQueryRunner();

      const subject = TEST_DATA.heartbeats[0];
      try {
        await queryRunner.startTransaction();
        const heartbeat = (
          await appService.getHeartbeats(
            {
              limit: 1,
              offset: 0,
              group: subject.group,
            },
            queryRunner,
          )
        )[0];

        expect(subject.group).toEqual(heartbeat.group);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('createHeartbeat()', () => {
    beforeAll(async () => {
      const queryRunner =
        appService.datasource.manager.connection.createQueryRunner();

      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should create a heartbeat', async () => {
      const queryRunner =
        await appService.datasource.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const queryConfig = { offset: TEST_DATA.heartbeats.length };

        const sizeBefore = (
          await appService.getHeartbeats(queryConfig, queryRunner)
        ).length;

        expect(sizeBefore).toEqual(0);

        await appService.createHeartbeat(
          {
            group: TEST_DATA.groups[0].group,
            id: 'NON_EXISTING_ID',
          },
          queryRunner,
        );

        const sizeAfter = (
          await appService.getHeartbeats(queryConfig, queryRunner)
        ).length;

        expect(sizeAfter).toEqual(1);

        expect(sizeAfter - sizeBefore).toEqual(1);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });

  describe('deleteHeartbeat()', () => {
    beforeAll(async () => {
      const queryRunner =
        appService.datasource.manager.connection.createQueryRunner();
      await seedTestData(queryRunner);
      await queryRunner.release();
    });

    it('should delete a heartbeat', async () => {
      const queryRunner =
        await appService.datasource.manager.connection.createQueryRunner();

      try {
        await queryRunner.startTransaction();

        const queryConfig = { offset: TEST_DATA.heartbeats.length - 1 };

        const sizeBefore = (
          await appService.getHeartbeats(queryConfig, queryRunner)
        ).length;

        expect(sizeBefore).toEqual(1);

        await appService.deleteHeartbeat(
          {
            id: TEST_DATA.heartbeats[0].id,
            group: TEST_DATA.heartbeats[0].group,
          },
          queryRunner,
        );

        const sizeAfter = (
          await appService.getHeartbeats(queryConfig, queryRunner)
        ).length;

        expect(sizeAfter).toEqual(0);

        expect(sizeBefore - sizeAfter).toEqual(1);
      } finally {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
      }
    });
  });
});
