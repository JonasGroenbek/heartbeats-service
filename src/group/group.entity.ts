import { Heartbeat } from '../heartbeat/heartbeat.entity';
import { BaseEntity } from '../postgres/base.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Group extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  group: string;

  @OneToMany(() => Heartbeat, (heartbeat) => heartbeat.groupInstance)
  heartbeats: Heartbeat[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', type: 'timestamptz' })
  public lastUpdatedAt: Date;

  public instances?: number;
}
