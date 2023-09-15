import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  create(createCompanyDto: CreateItemDto) {
    return this.itemRepository.save(createCompanyDto);
  }

  async findAll({
    take = 100,
    page = 1,
    search,
  }: {
    take: number;
    page: number;
    search?: string;
  }): Promise<{
    items: Item[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.itemRepository.createQueryBuilder();
    let queryText = '';
    if (search) {
      queryText = 'name LIKE :filter OR description LIKE :filter';
    }
    query
      .select()
      .where(queryText, {
        filter: `%${search}%`,
      })
      .take(take)
      .skip(skip);
    const items = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { items, total, pages, page, take };
  }

  findOne(id: number) {
    return this.itemRepository.findOneBy({ id });
  }

  update(id: number, updateCompanyDto: UpdateItemDto) {
    return this.itemRepository.update({ id }, updateCompanyDto);
  }

  async remove(id: number) {
    await this.itemRepository.query('SET FOREIGN_KEY_CHECKS=0');
    return this.itemRepository.delete(id);
  }
}
