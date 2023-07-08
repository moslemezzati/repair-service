import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  phone: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  username: string;
}
