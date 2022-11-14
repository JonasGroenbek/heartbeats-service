import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Heartbeat } from 'src/heartbeat/heartbeat.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { GroupService } from '../group/group.service';
import { HeartbeatService } from '../heartbeat/heartbeat.service';
import { CreateHeartbeat } from '../heartbeat/interface/create-heartbeat.interface';
import { DeleteHeartbeat } from '../heartbeat/interface/delete-heartbeat.interface';
import { GetGroupsDto } from './dto/get-groups.dto';
import { GetHeartbeatsDto } from './dto/get-heartbeats.dto';

/**
 * @description Used as a facade for the app.controller.ts
 * @export
 * @class AppService
 */
@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    public readonly datasource: DataSource,
    private readonly groupService: GroupService,
    private readonly heartbeatService: HeartbeatService,
  ) {}

  /**
   * @description Retrieves multiple groups
   * @param {GetHeartbeatsDto} dto
   * @return {*}  {Promise<Heartbeat[]>}
   */
  async getGroups(dto: GetGroupsDto, queryRunner?: QueryRunner) {
    return this.groupService.getMany(dto, queryRunner);
  }

  /**
   * @description Retrieves multiple heartbeats
   * @param {GetHeartbeatsDto} dto
   * @return {*}  {Promise<Heartbeat[]>}
   */
  async getHeartbeats(
    dto: GetHeartbeatsDto,
    queryRunner?: QueryRunner,
  ): Promise<Heartbeat[]> {
    return this.heartbeatService.getMany(dto, queryRunner);
  }

  /**
   * @description attempts to delete a heartbeat
   * @param {DeleteHeartbeat} dto
   * @return {*}  {Promise<number>} the amount of deleted heartbeats
   */
  async deleteHeartbeat(
    dto: DeleteHeartbeat,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    return this.heartbeatService.delete(dto, queryRunner);
  }

  /**
   * @description Creates a new heartbeat, or reassigns heartbeat.lastUpdatedAt to the current time
   * @param {CreateHeartbeat} dto
   */
  async createHeartbeat(dto: CreateHeartbeat, queryRunner?: QueryRunner) {
    if (queryRunner) {
      const heartbeat = await this.heartbeatService.getOne(dto, queryRunner);

      if (heartbeat) {
        await this.heartbeatService.update(
          dto,
          { lastUpdatedAt: new Date() },
          queryRunner,
        );
      } else {
        await this.heartbeatService.create(dto, queryRunner);
      }
      return;
    }

    queryRunner = await this.datasource.createQueryRunner();

    try {
      await queryRunner.startTransaction('READ COMMITTED');
      const heartbeat = await this.heartbeatService.getOne(dto, queryRunner);

      if (heartbeat) {
        await this.heartbeatService.update(
          dto,
          { lastUpdatedAt: new Date() },
          queryRunner,
        );
      } else {
        await this.heartbeatService.create(dto, queryRunner);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }
}
