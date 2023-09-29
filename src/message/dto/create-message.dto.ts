import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  body: string;

  @IsOptional()
  @IsNumber()
  adminId?: number;
}
