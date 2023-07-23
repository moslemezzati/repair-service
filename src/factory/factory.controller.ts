import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FactoryService } from './factory.service';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('factory')
@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  create(@Body() createFactoryDto: CreateFactoryDto) {
    return this.factoryService.create(createFactoryDto);
  }

  @Get()
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findAll() {
    return this.factoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findOne(@Param('id') id: string) {
    return this.factoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  update(@Param('id') id: string, @Body() updateFactoryDto: UpdateFactoryDto) {
    return this.factoryService.update(+id, updateFactoryDto);
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  remove(@Param('id') id: string) {
    return this.factoryService.remove(+id);
  }
}
