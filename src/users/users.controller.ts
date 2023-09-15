import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.upsert(createUserDto);
  }

  @Get('/')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async findAll(
    @Query()
    query: {
      take: number;
      page: number;
      search: string;
      role: string;
    },
  ) {
    return this.usersService.findAll({ ...query });
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async getUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);
    return { ...user };
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
