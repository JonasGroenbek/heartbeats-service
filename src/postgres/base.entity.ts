import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as _BaseEntity,
} from 'typeorm';

export class BaseEntity extends _BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'last_updated_at', type: 'timestamptz' })
  public lastUpdatedAt: Date;
}
