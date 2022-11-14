import { Group } from '../group/group.entity';
import { BaseEntity } from '../postgres/base.entity';
import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Heartbeat extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ name: 'group', type: 'int', nullable: true })
  group: string;

  @ManyToOne(() => Group, (group) => group.heartbeats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group', referencedColumnName: 'group' })
  groupInstance?: Group;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  meta?: any;
}
