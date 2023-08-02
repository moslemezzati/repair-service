import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Item)
  item: Item;

  @Column({ name: 'item_number' })
  itemNumber: number;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  public updatedAt: Date;
}
