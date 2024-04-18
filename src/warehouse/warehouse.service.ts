import { Injectable } from '@nestjs/common';
import { CreateWarehouseServiceDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {
  }

  create(createWarehouseDto: CreateWarehouseServiceDto) {
    return this.warehouseRepository
      .createQueryBuilder()
      .insert()
      .into(Warehouse)
      .values(createWarehouseDto)
      .execute();
  }

  async findAll({
                  take = 100,
                  page = 1,
                  search,
                  inventoryCoordinatorId,
                }: {
    take: number;
    page: number;
    search?: string;
    inventoryCoordinatorId: number;
  }): Promise<{
    warehouse: Warehouse[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.warehouseRepository.createQueryBuilder('warehouse');
    query
      .select()
      .where('inventoryCoordinatorId = :inventoryCoordinatorId', {
          inventoryCoordinatorId,
        },
      )
      .leftJoinAndSelect('warehouse.item', 'item')
      .leftJoinAndSelect('warehouse.company', 'company');
    if (search) {
      query.andWhere(
        '(itemId LIKE :filter OR companyId LIKE :filter OR type LIKE :filter)',
        {
          filter: `%${search}%`,
        });
    }
    query.take(take).skip(skip).orderBy('warehouse.createdAt', 'DESC');
    const items = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { warehouse: items, total, pages, page, take };
  }

  findOne(id: number) {
    return this.warehouseRepository.findOneBy({ id });
  }

  update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseRepository.update({ id }, updateWarehouseDto);
  }

  async remove(id: number) {
    await this.warehouseRepository.query('SET FOREIGN_KEY_CHECKS=0');
    return this.warehouseRepository.delete(id);
  }
}
