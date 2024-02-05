import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  serviceDate: string;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsOptional()
  itemId?: number;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({ type: String })
  @IsNumber()
  @IsOptional()
  itemNumber?: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  companyId: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  deviceId: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  salonId: number;
}
