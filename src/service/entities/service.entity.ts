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
import { Device } from '../../device/entities/device.entity';
import { Salon } from '../../salon/entities/salon';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'itemId' })
  item?: Item;

  @Column({ default: null })
  itemId?: number;

  @Column({ default: 0 })
  itemNumber?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Device, { nullable: true })
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @Column()
  deviceId: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: number;

  @ManyToOne(() => Salon, { nullable: true })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @Column()
  salonId: number;

  @Column()
  serviceDate: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
