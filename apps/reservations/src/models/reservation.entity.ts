import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity() // Creates a table based on this schema
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  timestamp: Date;
  @Column()
  startDate: Date;
  @Column()
  endDate: Date;
  @Column()
  userId: number;
  @Column()
  invoiceId: string;
}
