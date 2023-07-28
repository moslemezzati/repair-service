import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['company'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findUser(mobile: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ mobile, password });
    console.log({ user, mobile, password });
    return user;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(userData: CreateUserDto): Promise<any> {
    const { companyId, ...data } = userData;
    return await this.usersRepository.save({
      ...data,
      company: companyId as unknown as Company,
    });
  }
}
