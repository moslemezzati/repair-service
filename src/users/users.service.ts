import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './user.dto';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
  }): Promise<{
    users: ResponseUserDto[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.usersRepository.createQueryBuilder('user');
    query
      .leftJoinAndSelect('user.company', 'company')
      .where('user.role IN (:...roles)', {
        roles: ['technician', 'worker'],
      })
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.role',
        'user.createdAt',
        'user.mobile',
        'company',
      ]);
    query.andWhere('user.adminId = :adminId', { adminId });
    if (search) {
      query.andWhere(
        '(user.firstName LIKE :filter OR user.lastName LIKE :filter OR user.mobile LIKE :filter)',
        { filter: `%${search}%` },
      );
    }
    query.skip(skip).take(take).orderBy('user.createdAt', 'DESC');
    const [users, total] = await query.getManyAndCount();
    const pages = Math.ceil(total / take);
    return { users, total, pages, page, take };
  }

  async findOne(id: number): Promise<ResponseUserDto | null> {
    return this.usersRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  async findUser(mobile: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ mobile, password });
    console.log({ user, mobile, password });
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  insert(userData: CreateUserDto): Promise<any> {
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(userData)
      .execute();
  }

  async update(userData: UpdateUserDto): Promise<any> {
    const query = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(userData)
      .where('id = :id', { id: userData.id })
      .execute();
    console.log('update', query);
    return query;
  }

  async findUsersByCompanyId(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      company: id as unknown as Company,
    });
    console.log(user);
    return user;
  }
}
