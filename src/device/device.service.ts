import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  create(createServiceDto: CreateDeviceDto) {
    return this.deviceRepository.save(createServiceDto);
  }

  async findAll({
    take = 100,
    page = 1,
    search,
    adminId,
  }: {
    take: number;
    page: number;
    search?: string;
    adminId: number;
    companyId?: number;
  }): Promise<{
    devices: Device[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.deviceRepository.createQueryBuilder('device');
    query
      .select()
      .where('device.adminId = :adminId', { adminId })
      .leftJoinAndSelect('device.company', 'company');
    if (search) {
      query.andWhere('(name LIKE :filter OR description LIKE :filter)', {
        filter: `%${search}%`,
      });
    }
    query.take(take).skip(skip).orderBy('device.createdAt', 'DESC');
    const devices = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { devices, total, pages, page, take };
  }

  findOne(id: number) {
    return this.deviceRepository.findOneBy({ id });
  }

  update(id: number, updateCompanyDto: UpdateDeviceDto) {
    return this.deviceRepository.update({ id }, updateCompanyDto);
  }

  async remove(id: number) {
    await this.deviceRepository.query('SET FOREIGN_KEY_CHECKS=0');
    return this.deviceRepository.delete(id);
  }
}
