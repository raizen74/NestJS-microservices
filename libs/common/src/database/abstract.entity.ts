import {PrimaryGeneratedColumn} from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  constructor (entity: Partial<T>) {
    Object.assign(this, entity);  // all the properties passed to the constructor will be copied over to the instance
  }
}