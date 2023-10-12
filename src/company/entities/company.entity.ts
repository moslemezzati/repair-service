import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
@Unique("adminId"',"name"'])
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'adminId' })
  user: User;

  @Column()
  adminId: number;
}
