import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseControllerDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Role } from '../users/enums/role.enum';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiForbiddenResponse } from '@nestjs/swagger';

@Auth(AuthType.Bearer)
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {
  }

  @Post()
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.STORE_KEEPER)
  create(
    @Body() createWarehouseDto: CreateWarehouseControllerDto,
    @ActiveUser() { adminId, sub }: ActiveUserData,
  ) {
    return this.warehouseService.create({
      ...createWarehouseDto,
      inventoryCoordinatorId: sub,
      adminId,
    });
  }

  @Get()
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiImplicitQuery({
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiImplicitQuery({
    name: 'skip',
    required: false,
    type: Number,
  })
  @Roles(Role.STORE_KEEPER, Role.ADMIN)
  findAll(
    @Query()
      query: {
      take: number;
      page: number;
      search: string;
    },
    @ActiveUser() { adminId, sub }: ActiveUserData,
  ) {
    return this.warehouseService.findAll({
      ...query,
      adminId: adminId || sub,
    });
  }

  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.STORE_KEEPER, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(+id);
  }

  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.STORE_KEEPER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(+id);
  }
}
