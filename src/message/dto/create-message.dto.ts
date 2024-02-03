import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Role} from "../../users/enums/role.enum";

export class CreateMessageDto {
	@ApiProperty({
		type: String,
		description: 'This is a required property',
	})
	@IsString()
	title: string;
	
	@ApiProperty({
		type: String,
		description: 'This is a required property',
	})
	@IsString()
	@IsOptional()
	role?: Role;
	
	@ApiProperty({
		type: String,
	})
	@IsString()
	body: string;
	
	@IsNumber()
	adminId: number;
}
