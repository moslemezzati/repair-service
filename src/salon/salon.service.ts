import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { SalonEntity } from './entities/salon.entity';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(SalonEntity)
    private salonRepository: Repository<SalonEntity>,
  ) {}

  create(createSalonDto: CreateSalonDto) {
    return this.salonRepository.save(createSalonDto);
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
    salons: SalonEntity[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.salonRepository.createQueryBuilder('salon');
    query
      .select()
      .where('salon.adminId = :adminId', { adminId })
      .leftJoinAndSelect('salon.company', 'company');
    if (search) {
      query.andWhere(
        '(salon.name LIKE :filter OR salon.description LIKE :filter OR company.name LIKE :filter)',
        {
          filter: `%${search}%`,
        },
      );
    }
    query.take(take).skip(skip).orderBy('salon.createdAt', 'DESC');
    const salons = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { salons, total, pages, page, take };
  }

  findOne(id: number) {
    return this.salonRepository.findOneBy({ id });
  }

  update(id: number, updateSalonDto: UpdateSalonDto) {
    return this.salonRepository.update({ id }, updateSalonDto);
  }

  async remove(id: number) {
    await this.salonRepository.query('SET FOREIGN_KEY_CHECKS=0');
    return this.salonRepository.delete(id);
  }
}
