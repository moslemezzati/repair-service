import { Injectable } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Factory } from './entities/factory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FactoryService {
  constructor(
    @InjectRepository(Factory)
    private factoryRepository: Repository<Factory>,
  ) {}
  create(createFactoryDto: CreateFactoryDto) {
    return this.factoryRepository.save(createFactoryDto);
  }

  findAll() {
    return this.factoryRepository.find();
  }

  findOne(id: number) {
    return this.factoryRepository.findOneBy({ id });
  }

  update(id: number, updateFactoryDto: UpdateFactoryDto) {
    return this.factoryRepository.update({ id }, updateFactoryDto);
  }

  remove(id: number) {
    return this.factoryRepository.delete(id);
  }
}
