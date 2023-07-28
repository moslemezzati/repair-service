import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from '../company/entities/company.entity';

export enum Roles {
  ADMIN = 'admin',
  TECHNICIAN = 'technician',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.TECHNICIAN })
  role: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Company)
  @JoinColumn()
  company: Company;
}
