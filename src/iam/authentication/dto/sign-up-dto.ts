import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from './sign-in-dto';

export class SignUpDto extends SignInDto {
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
}
