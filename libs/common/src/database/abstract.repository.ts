import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

// forces the generic type inherit _id from AbstractDocument
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger; // makes AbstractRepository create

  constructor(protected readonly model: Model<TDocument>) {}

  // document type does not include '_id'
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(), // '_id' is generated here
    });

    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  // FilterQuery<TDocument> -> Filters on properties of TDocument
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true); //.lean(true) avoids extra fields from mongodb

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found.');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>(true); //.lean(true) avoids extra fields from mongodb

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found.');
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true) as unknown as TDocument;
  }
}
