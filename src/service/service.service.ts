import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  create(serviceData: CreateServiceDto) {
    const { itemId, ...data } = serviceData;
    return this.serviceRepository.save({
      ...data,
      item: itemId as unknown as Item,
    });
  }

  findAll() {
    return this.serviceRepository.find();
  }

  findOne(id: number) {
    return this.serviceRepository.findOneBy({ id });
  }

  update(id: number, serviceData: UpdateServiceDto) {
    const { itemId, ...data } = serviceData;
    return this.serviceRepository.save({
      ...data,
      item: itemId as unknown as Item,
    });
  }

  remove(id: number) {
    return this.serviceRepository.delete(id);
  }
}
