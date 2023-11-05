import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Role } from '../users/enums/role.enum';

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
    userId,
    role,
    adminId,
  }: {
    take: number;
    page: number;
    search?: string;
    userId?: number;
    role?: Role;
    adminId?: number;
  }): Promise<{
    services: Service[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;

    const query = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.item', 'item')
      .leftJoinAndSelect('service.device', 'device')
      .leftJoinAndSelect('service.salon', 'salon')
      .leftJoinAndSelect('service.company', 'company')
      .leftJoinAndSelect('service.user', 'user', 'user.id = service.userId')
      .select([
        'service.id',
        'service.name',
        'service.description',
        'service.serviceDate',
        'service.createdAt',
        'item',
        'device',
        'salon',
        'company',
        'user.firstName',
        'user.lastName',
      ]);
    if (role === Role.ADMIN) {
      query.where('user.adminId = :adminId', { adminId });
    } else {
      query.where('userId = :userId', { userId });
    }
    if (search) {
      query.andWhere(
        '(service.name LIKE :filter OR ' +
          'service.description LIKE :filter OR ' +
          'salon.name LIKE :filter OR ' +
          'company.name LIKE :filter OR ' +
          'user.firstName LIKE :filter OR ' +
          'user.lastName LIKE :filter OR ' +
          'device.name LIKE :filter)',
        {
          filter: `%${search}%`,
        },
      );
    }
    query.take(take).skip(skip).orderBy('service.createdAt', 'DESC');
    const services = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { services, total, pages, page, take };
  }

  async findOne(serviceId: number) {
    const result = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.item', 'item')
      .where('service.id = :id', { id: serviceId })
      .select(['service', 'item.id', 'item.name'])
      .getOne();

    return result;
  }

  update(serviceData: UpdateServiceDto) {
    return this.serviceRepository
      .createQueryBuilder()
      .update(Service)
      .set(serviceData)
      .where('id = :id', { id: serviceData.id })
      .execute();
  }

  remove(id: number) {
    return this.serviceRepository.delete(id);
  }
}
