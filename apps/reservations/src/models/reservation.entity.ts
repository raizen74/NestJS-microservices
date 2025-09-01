import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity() // Creates a table based on this schema
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  declare timestamp: Date;
  @Column()
  declare startDate: Date;
  @Column()
  declare endDate: Date;
  @Column()
  declare userId: number;
  @Column()
  declare invoiceId: string;
}
