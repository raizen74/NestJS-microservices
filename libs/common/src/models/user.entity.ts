import { AbstractEntity } from '../database';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  declare email: string;

  @Column()
  declare password: string;

  // ManyToMany -> Many Users can have many Roles
  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  declare roles?: Role[];
}
