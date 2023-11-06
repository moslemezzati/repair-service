import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Item])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
