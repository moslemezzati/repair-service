import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { WarehouseType } from '../entities/warehouse.entity';

export class CreateWarehouseDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String })
  @IsString()
  type: WarehouseType;

  @ApiProperty({ type: String })
  @IsNumber()
  itemId: number;

  @ApiProperty({ type: String })
  @IsNumber()
  companyId: number;
}

export class CreateWarehouseControllerDto extends CreateWarehouseDto {}
export class CreateWarehouseServiceDto extends CreateWarehouseDto {
  @IsNumber()
  inventoryCoordinatorId: number;
}
