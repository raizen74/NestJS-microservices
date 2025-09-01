import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

// T is the entity that subclasses of AbstractRepository will be passing, which extends AbstractEntity
export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger; // makes AbstractRepository create

  constructor(
    // entityRepository will be used to find entities in the mysql DB
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager, // Allow us to save entities in the DB
  ) {}

  // document type does not include '_id'
  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  // FilterQuery<TDocument> -> Filters on properties of TDocument
  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.entityRepository.findOne({
      where,
    });

    if (!entity) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>, // subset of props that exist in our entity
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    // check if affected entities are 0
    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity was not found.');
    }

    return this.findOne(where); // return the updated entity
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.entityRepository.findBy(where); // find multiple entities matched by the where clause
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    return this.entityRepository.delete(where);
  }
}
