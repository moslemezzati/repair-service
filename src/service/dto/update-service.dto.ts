import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { IsNumber } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNumber()
  id: number;
}
