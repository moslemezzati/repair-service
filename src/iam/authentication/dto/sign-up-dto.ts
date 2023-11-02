import { IsMobilePhone, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
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
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsMobilePhone('fa-IR')
  mobile: string;
}
