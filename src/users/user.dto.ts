import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsMobilePhone, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from './enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsMobilePhone('fa-IR')
  mobile: string;

  @ApiPropertyOptional({
    enum: Role,
    enumName: 'Role',
    description: 'This is a not required property',
  })
  @IsString()
  role: Role;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is a required property',
  })
  @IsNumber()
  @IsOptional()
  companyId: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is a required property',
  })
  @IsNumber()
  @IsOptional()
  adminId?: number;
}

export class ResponseUserDto extends CreateUserDto {}

export class UpdateUserDto extends CreateUserDto {
  id: number;

  @IsOptional()
  @IsString()
  password: string;
}

export class GetUserDto {
  firstName: string;
  lastName: string;
  mobile: string;
  role: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<GetUserDto>) {
    Object.assign(this, partial);
  }
}
