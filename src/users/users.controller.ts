import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
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
    return this.usersService.insert(createUserDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Find all users' })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'role', type: String, required: false })
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async findAll(
    @Query()
    query: {
      take: number;
      page: number;
      search: string;
      adminId: number;
    },
  ) {
    return this.usersService.findAll(query);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async getUser(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.usersService.findOne(+id);
    return { ...user };
  }

  @Put('/:id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<User> {
    return this.usersService.update({ ...updateUserDto, id });
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
