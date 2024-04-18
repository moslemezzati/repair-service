import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { User } from '../../users/user.entity';
import { Company } from '../../company/entities/company.entity';

export enum WarehouseType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: WarehouseType, default: WarehouseType.IMPORT })
  type: WarehouseType;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'itemId' })
  item?: Item;

  @Column({ default: null })
  itemId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'inventoryCoordinatorId' })
  inventoryCoordinator: User;

  @Column()
  inventoryCoordinatorId: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'adminId' })
  user: User;

  @Column()
  adminId: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;
}
