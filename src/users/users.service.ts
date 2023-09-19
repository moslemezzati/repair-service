import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles, User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
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
    role = Roles.TECHNICIAN,
  }: {
    take: number;
    page: number;
    search?: string;
    role?: string;
  }): Promise<{
    users: User[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;

    // const [users, total]
    const query = this.usersRepository.createQueryBuilder();
    let queryText = 'role = :role';
    if (search) {
      queryText +=
        ' AND firstName LIKE :filter OR lastName LIKE :filter OR mobile LIKE :filter';
    }
    query
      .select()
      .where(queryText, {
        role,
        filter: `%${search}%`,
      })
      .skip(skip)
      .take(take);
    const users = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { users, total, pages, page, take };
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { company: true },
    });
    return user;
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
