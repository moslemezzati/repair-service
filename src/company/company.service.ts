import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private usersService: UsersService,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.companyRepository.save(createCompanyDto);
  }

  async findAll({
    take = 100,
    page = 1,
    adminId,
    search,
  }: {
    take: number;
    page: number;
    adminId: number;
    search?: string;
  }): Promise<{
    companies: Company[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    page = +page;
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.companyRepository.createQueryBuilder('company');
    query.where(`adminId = :adminId`, { adminId });
    if (search) {
      query.andWhere(`(address LIKE :search OR name LIKE :search)`, {
        search: `%${search}%`,
      });
    }
    query.take(take).skip(skip).orderBy('createdAt', 'DESC');
    const [companies, total] = await query.getManyAndCount();
    const pages = Math.ceil(total / take);
    return { companies, total, pages, page, take };
  }

  findOne(id: number) {
    return this.companyRepository.findOneBy({ id });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return this.companyRepository.update({ id }, updateCompanyDto);
  }

  async remove(id: number) {
    const users = (await this.usersService.findUsersByCompanyId(
      id,
    )) as unknown as User[];
    if (Array.isArray(users)) {
      await Promise.all(
        users.map((user) => {
          user.companyId = null;
          return this.usersService.update(user);
        }),
      );
    } else {
      (users as User).companyId = null;
      await this.usersService.update(users);
    }
    await this.companyRepository.query('SET FOREIGN_KEY_CHECKS=0');
    const result = await this.companyRepository.delete(id);
    await this.companyRepository.query('SET FOREIGN_KEY_CHECKS=1');
    return result;
  }
}
