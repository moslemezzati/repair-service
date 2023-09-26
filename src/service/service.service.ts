import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  create(serviceData: CreateServiceDto) {
    return this.serviceRepository
      .createQueryBuilder()
      .insert()
      .into(Service)
      .values(serviceData)
      .execute();
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
    services: Service[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const where = [];
    if (search) {
      where.push({ description: ILike(`%${search}%`) });
      where.push({ name: ILike(`%${search}%`) });
    }
    const [services, total] = await this.serviceRepository.findAndCount({
      take,
      skip,
      where,
    });
    const pages = Math.ceil(total / take);
    return { services, total, pages, page, take };
  }

  async findOne(serviceId: number) {
    const result = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.item', 'item')
      .where('service.id = :id', { id: serviceId })
      .select(['service', 'item.id', 'item.name']) // Select the required columns
      .getOne();

    const { id, name, description, item, itemNumber } = result;
    const { id: itemId } = item;

    return {
      id,
      name,
      description,
      itemId,
      itemNumber,
    };
  }

  update(serviceData: UpdateServiceDto) {
    console.log(serviceData);
    return this.serviceRepository
      .createQueryBuilder()
      .update(Service)
      .set({
        description: serviceData.description,
        name: serviceData.name,
        itemNumber: serviceData.itemNumber,
        itemId: serviceData.itemId,
      })
      .where('id = :id', { id: serviceData.id })
      .execute();
  }

  remove(id: number) {
    return this.serviceRepository.delete(id);
  }
}
