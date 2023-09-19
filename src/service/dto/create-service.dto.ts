import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  itemId: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  itemNumber: number;
}
