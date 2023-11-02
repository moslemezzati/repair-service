import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'adminId' })
  user: User;

  @Column()
  adminId: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
