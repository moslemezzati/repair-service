import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { Role } from './enums/role.enum';

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

  @Column({ type: 'enum', enum: Role, default: Role.TECHNICIAN })
  role: Role;

  @Column({ unique: true })
  mobile: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ default: null })
  companyId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'adminId' })
  user: User;

  @Column({ default: null })
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
