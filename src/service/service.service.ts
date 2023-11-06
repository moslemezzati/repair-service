import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Role } from '../users/enums/role.enum';
import { Item } from '../item/entities/item.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private readonly i18n: I18nService,
  ) {}

  private async updateItemAmount(
    serviceDto: CreateServiceDto,
    previousUpdatedAmount = 0,
  ) {
    const item = await this.itemRepository.findOneBy({
      id: serviceDto.itemId,
    });
    if (!item) {
      throw new HttpException(
        this.i18n.t('errors.Item is not valid'),
        HttpStatus.BAD_REQUEST,
      );
    }
    item.amount += previousUpdatedAmount;
    if (item.amount < serviceDto.itemNumber) {
      const err = this.i18n.t('errors.The maximum item number must be.', {
        args: { amount: item.amount },
      });

      throw new HttpException(err, HttpStatus.BAD_REQUEST, {
        description: err,
      });
    }

    const update = await this.itemRepository.update(
      { id: serviceDto.itemId },
      { amount: item.amount - serviceDto.itemNumber },
    );
    if (update.affected == 0) {
      throw new HttpException(
        this.i18n.t('errors.Could not update the item amount.'),
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async create(serviceData: CreateServiceDto) {
    await this.updateItemAmount(serviceData);
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

  async update(serviceData: UpdateServiceDto) {
    const service = await this.findOne(serviceData.id);
    const { id, ...data } = serviceData;
    await this.updateItemAmount(data as CreateServiceDto, service.itemNumber);
    return this.serviceRepository
      .createQueryBuilder()
      .update(Service)
      .set(serviceData)
      .where('id = :id', { id: serviceData.id })
      .execute();
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    await this.updateItemAmount(
      { ...service, itemNumber: 0 },
      service.itemNumber,
    );
    return this.serviceRepository.delete(id);
  }
}
