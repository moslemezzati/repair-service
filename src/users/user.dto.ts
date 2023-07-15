import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

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
  mobile: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  role: string;
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
