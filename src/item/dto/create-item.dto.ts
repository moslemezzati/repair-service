import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  adminId?: number;
}
