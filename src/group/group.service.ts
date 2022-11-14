import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetGroupsDto } from '../app/dto/get-groups.dto';
import {
  DeleteQueryBuilder,
  InsertQueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Group } from './group.entity';

/**
 * @description This service governs contact with the group table
 * @export
 * @class GroupService
 */
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    public readonly groupRepository: Repository<Group>,
  ) {}

  /**
   * @description Creates a single group
   * @param {string} group the group that will be created
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations If the query should be managed, provide a query runner
   */
  async create(group: string, queryRunner?: QueryRunner) {
    const query = this.createInsertQuery([{ group }], queryRunner);
    await query.execute();
  }

  /**
   * @description Deletes a group
   * @param {string} group the group to delete
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations A single connection, used to manage multiple database operations
   */
  async delete(group: string, queryRunner?: QueryRunner) {
    const { affected } = await this.createDeleteQuery(
      { group },
      queryRunner,
    ).execute();
    return affected;
  }

  /**
   * @description Retrieves single group
   * @param {string} group the group to retrieve
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {Promise<Group>}
   */
  async getOne(group: string, queryRunner?: QueryRunner): Promise<Group> {
    return this.createSelectQuery({ group }, queryRunner).getOne();
  }

  /**
   * @description Retrieves multiple groups
   * @param {GetGroupsDto} queryConfig Specifies filtesr
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {Promise<Group[]>}
   */
  async getMany(
    queryConfig: GetGroupsDto,
    queryRunner?: QueryRunner,
  ): Promise<Group[]> {
    return this.createSelectQuery(queryConfig, queryRunner).getMany();
  }

  /**
   * @description Retrieves multiple groups with a table total
   * @param {GetGroupsDto} queryConfig Specifies filters
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {Promise<{ entities: Group[]; count: number }>}
   */
  async getManyWithCount(
    queryConfig: GetGroupsDto,
    queryRunner?: QueryRunner,
  ): Promise<{ entities: Group[]; count: number }> {
    const [groups, count] = await this.createSelectQuery(
      queryConfig,
      queryRunner,
    ).getManyAndCount();

    return {
      entities: groups,
      count,
    };
  }

  /**
   * @description This function is responsible for creating a valid insert query.
   * This should be an extensible and general function that can be used for all
   * insertions in this service
   * @private
   * @param {(Omit<Partial<Group>, 'createdAt' | 'lastUpdatedAt'>)} entity
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {InsertQueryBuilder<Group>}
   */
  private createInsertQuery(
    entities: Omit<Partial<Group>, 'createdAt' | 'lastUpdatedAt'>[],
    queryRunner?: QueryRunner,
  ): InsertQueryBuilder<Group> {
    let query: InsertQueryBuilder<Group>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Group)
        .createQueryBuilder('group')
        .insert();
    } else {
      query = this.groupRepository.createQueryBuilder('group').insert();
    }

    query.values(entities);

    return query;
  }

  /**
   * @description This function is responsible for creating a valid delete query.
   * This should be an extensible and general function that can be used for all
   * deletions in this service
   * @private
   * @param {GetGroupsDto} queryConfig
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {DeleteQueryBuilder<Group>}
   */
  private createDeleteQuery(
    queryConfig: GetGroupsDto,
    queryRunner?: QueryRunner,
  ): DeleteQueryBuilder<Group> {
    let query: DeleteQueryBuilder<Group>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Group)
        .createQueryBuilder('group')
        .delete();
    } else {
      query = this.groupRepository.createQueryBuilder('group').delete();
    }

    if (queryConfig.group) {
      query.andWhere(`"group".group = :group`, { group: queryConfig.group });
    }

    return query;
  }

  /**
   * @description This function is responsible for creating a valid select query.
   * This should be an extensible and general function that can be used for all
   * selections in this service
   * @private
   * @param {GetGroupsDto} queryConfig
   * @param {QueryRunner} [queryRunner] A single connection, used to manage multiple database operations
   * @return {*}  {SelectQueryBuilder<Group>}
   */
  private createSelectQuery(
    queryConfig: GetGroupsDto,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Group> {
    let query: SelectQueryBuilder<Group>;

    if (queryRunner) {
      query = queryRunner.manager
        .getRepository(Group)
        .createQueryBuilder('group')
        .select();
    } else {
      query = this.groupRepository.createQueryBuilder('group').select();
    }

    if (queryConfig.withHeartbeatCount) {
      query.loadRelationCountAndMap('group.instances', 'group.heartbeats');
    }

    if (queryConfig.group) {
      query.andWhere(`group.group = :group`, { group: queryConfig.group });
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
