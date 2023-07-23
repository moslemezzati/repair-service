import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFactoryDto {
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
  address: string;
}
