import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteQueryBuilder,
  InsertQueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { GetHeartbeatDto } from '../app/dto/get-heartbeat.dto';
import { GetHeartbeatsDto } from '../app/dto/get-heartbeats.dto';
import { Heartbeat } from './heartbeat.entity';
import { CreateHeartbeat } from './interface/create-heartbeat.interface';
import { DeleteHeartbeat } from './interface/delete-heartbeat.interface';

/**
 * @description This service governs contact with the heartbeat table
 * @export
 * @class HeartbeatService
 */
@Injectable()
export class HeartbeatService {
  constructor(
    @InjectRepository(Heartbeat)
    readonly heartbeatRepository: Repository<Heartbeat>,
  ) {}

  /**
   * @description Creates a single heartbeat
   * @param {CreateHeartbeat} args the properties to create on the heartbeat
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   */
  async create(args: CreateHeartbeat, queryRunner?: QueryRunner) {
    const query = this.createInsertQuery([args], queryRunner);
    await query.execute();
  }

  /**
   * @description Deletes a heartbeat
   * @param {DeleteHeartbeat} queryConfig specifies what to delete
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   */
  async delete(
    queryConfig: DeleteHeartbeat,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    const { affected } = await this.createDeleteQuery(
      queryConfig,
      queryRunner,
    ).execute();
    return affected;
  }

  /**
   * @description Retrieves single heartbeat
   * @param {GetHeartbeatDto} queryConfig specifies filters to get heartbeat
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {Promise<Heartbeat>}
   */
  async getOne(
    queryConfig: GetHeartbeatDto,
    queryRunner?: QueryRunner,
  ): Promise<Heartbeat> {
    return await this.createSelectQuery(queryConfig, queryRunner).getOne();
  }

  /**
   * @description Updates multiple heartbeats
   * @param {GetHeartbeatDto} queryConfig Specifies what to udpate
   * @param {Partial<Heartbeat>} values Columns to update
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}
   */
  async update(
    queryConfig: GetHeartbeatDto,
    values: Partial<Heartbeat>,
    queryRunner?: QueryRunner,
  ): Promise<UpdateResult> {
    return this.createUpdateQuery(queryConfig, values, queryRunner).execute();
  }

  /**
   * @description Retrieves multiple heartbeats
   * @param {GetHeartbeatsDto} queryConfig Specifies filters
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {Promise<Heartbeat[]>}
   */
  async getMany(
    queryConfig: GetHeartbeatsDto,
    queryRunner?: QueryRunner,
  ): Promise<Heartbeat[]> {
    return this.createSelectQuery(queryConfig, queryRunner).getMany();
  }

  /**
   * @description Retrieves multiple heartbeats with a table total
   * @param {GetHeartbeatsDto} queryConfig Specifies filters
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {Promise<{ entities: Heartbeat[]; count: number }>}
   */
  async getManyWithCount(
    queryConfig: GetHeartbeatsDto,
    queryRunner?: QueryRunner,
  ): Promise<{ entities: Heartbeat[]; count: number }> {
    const [heartbeats, count] = await this.createSelectQuery(
      queryConfig,
      queryRunner,
    ).getManyAndCount();

    return {
      entities: heartbeats,
      count,
    };
  }

  /**
   * @description This function is responsible for creating a valid insert query.
   * This should be an extensible and general function that can be used for all
   * insertions in this service
   * @private
   * @param {(Omit<Partial<Heartbeat>, 'createdAt' | 'lastUpdatedAt'>[])} entities
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {InsertQueryBuilder<Heartbeat>}
   */
  private createInsertQuery(
    entities: Omit<Partial<Heartbeat>, 'createdAt' | 'lastUpdatedAt'>[],
    queryRunner?: QueryRunner,
  ): InsertQueryBuilder<Heartbeat> {
    let query: InsertQueryBuilder<Heartbeat>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Heartbeat)
        .createQueryBuilder('heartbeat')
        .insert();
    } else {
      query = this.heartbeatRepository.createQueryBuilder('heartbeat').insert();
    }

    query.values(entities);

    return query;
  }

  /**
   * @description This function is responsible for creating a valid update query.
   * This should be an extensible and general function that can be used for all
   * updates in this service
   * @private
   * @param {GetHeartbeatDto} queryConfig
   * @param {Partial<Heartbeat>} values
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {UpdateQueryBuilder<Heartbeat>}
   */
  private createUpdateQuery(
    queryConfig: GetHeartbeatDto,
    values: Partial<Heartbeat>,
    queryRunner?: QueryRunner,
  ): UpdateQueryBuilder<Heartbeat> {
    let query: UpdateQueryBuilder<Heartbeat>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Heartbeat)
        .createQueryBuilder('heartbeat')
        .update();
    } else {
      query = this.heartbeatRepository.createQueryBuilder('heartbeat').update();
    }

    query.set(values);

    if (queryConfig.group) {
      query.andWhere(`heartbeat.group = :group`, { group: queryConfig.group });
    }

    if (queryConfig.id) {
      query.andWhere(`heartbeat.id = :id`, { id: queryConfig.id });
    }

    return query;
  }

  /**
   * @description This function is responsible for creating a valid delete query.
   * This should be an extensible and general function that can be used for all
   * deletions in this service
   * @private
   * @param {DeleteHeartbeat} queryConfig
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {DeleteQueryBuilder<Heartbeat>}
   */
  private createDeleteQuery(
    queryConfig: DeleteHeartbeat,
    queryRunner?: QueryRunner,
  ): DeleteQueryBuilder<Heartbeat> {
    let query: DeleteQueryBuilder<Heartbeat>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Heartbeat)
        .createQueryBuilder('heartbeat')
        .delete();
    } else {
      query = this.heartbeatRepository.createQueryBuilder('heartbeat').delete();
    }

    if (queryConfig.group) {
      query.andWhere(`heartbeat.group = :group`, { group: queryConfig.group });
    }

    if (queryConfig.id) {
      query.andWhere(`heartbeat.id = :id`, { id: queryConfig.id });
    }

    return query;
  }

  /**
   * @description This function is responsible for creating a valid select query.
   * This should be an extensible and general function that can be used for all
   * selections in this service
   * @private
   * @param {GetHeartbeatsDto} queryConfig
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {SelectQueryBuilder<Heartbeat>}
   */
  private createSelectQuery(
    queryConfig: GetHeartbeatsDto,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Heartbeat> {
    let query: SelectQueryBuilder<Heartbeat>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Heartbeat)
        .createQueryBuilder('heartbeat')
        .select();
    } else {
      query = this.heartbeatRepository.createQueryBuilder('heartbeat').select();
    }

    if (queryConfig.group) {
      query.andWhere(`heartbeat.group = :group`, { group: queryConfig.group });
    }

    if (queryConfig.id) {
      query.andWhere(`heartbeat.id = :id`, { id: queryConfig.id });
    }

    if (queryConfig.offset) {
      query.skip(queryConfig.offset);
    }
    if (queryConfig.limit) {
      query.take(queryConfig.limit);
    }

    return query;
  }
}
