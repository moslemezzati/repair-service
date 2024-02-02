import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import {User} from '../../users/user.entity';
import {Role} from "../../users/enums/role.enum";
import {IsString} from "class-validator";

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column()
	title: string;
	
	@Column({nullable: true, type: 'text'})
	body: string;
	
	@ManyToOne(() => User)
	@JoinColumn({name: 'adminId'})
	user: User;
	
	@Column()
	adminId: number;
	
	@Column({
		type: "enum",
		enum: Role,
		nullable: true,
		default: undefined,
	})
	@IsString()
	role?: Role;
	
	@CreateDateColumn({
		type: 'timestamp',
	})
	createdAt: Date;
}
