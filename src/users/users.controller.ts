import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './user.dto';
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
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { Role } from './enums/role.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.ADMIN)
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.usersService.insert({ ...createUserDto, adminId: user.sub });
  }

  @Get('/')
  @ApiOperation({ summary: 'Find all users' })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'role', type: String, required: false })
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.ADMIN)
  async findAll(
    @Query()
    query: {
      take: number;
      page: number;
      search: string;
    },
    @ActiveUser() user: ActiveUserData,
  ) {
    const { sub } = user;
    return this.usersService.findAll({ ...query, adminId: sub });
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async getUser(@Param('id') id: string): Promise<GetUserDto> {
    const user = await this.usersService.findOne(+id);
    return new GetUserDto(user);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.ADMIN)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ): Promise<User> {
    return this.usersService.update({ ...updateUserDto, id });
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
