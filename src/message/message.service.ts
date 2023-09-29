import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return this.messageRepository.save(createMessageDto);
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
  }): Promise<{
    messages: Message[];
    total: number;
    pages: number;
    page: number;
    take: number;
  }> {
    take = +take;
    const skip = (page - 1) * take || 0;
    const query = this.messageRepository.createQueryBuilder();
    if (search) {
      query.where('(title LIKE :filter OR body LIKE :filter)', {
        filter: `%${search}%`,
      });
    }
    query.andWhere('adminId = :adminId', { adminId }).take(take).skip(skip);
    const messages = await query.getMany();
    const total = await query.getCount();
    const pages = Math.ceil(total / take);
    return { messages, total, pages, page, take };
  }

  findOne(id: number) {
    return this.messageRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.messageRepository.query('SET FOREIGN_KEY_CHECKS=0');
    return this.messageRepository.delete(id);
  }
}
