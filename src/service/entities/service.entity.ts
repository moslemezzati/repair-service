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

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemNumber: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  public updatedAt: Date;
}
