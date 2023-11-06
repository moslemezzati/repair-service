import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';

@Auth(AuthType.Bearer)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.ADMIN)
  create(
    @Body() createItemDto: CreateItemDto,
    @ActiveUser() { adminId }: ActiveUserData,
  ) {
    return this.itemService.create({ ...createItemDto, adminId });
  }

  @Get()
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findAll(
    @Query()
    query: {
      take: number;
      page: number;
      search: string;
      role: string;
    },
    @ActiveUser() { adminId }: ActiveUserData,
  ) {
    return this.itemService.findAll({ ...query, adminId });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
