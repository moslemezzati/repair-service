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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';

@Auth(AuthType.Bearer)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.TECHNICIAN)
  create(
    @Body() createServiceDto: CreateServiceDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.serviceService.create({
      ...createServiceDto,
      userId: user.sub,
    });
  }

  @Get()
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiImplicitQuery({
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiImplicitQuery({
    name: 'skip',
    required: false,
    type: Number,
  })
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  findAll(
    @Query()
    query: {
      take: number;
      page: number;
      search: string;
    },
    @ActiveUser() { sub, role, adminId }: ActiveUserData,
  ) {
    return this.serviceService.findAll({
      ...query,
      userId: sub,
      role,
      adminId,
    });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.TECHNICIAN)
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.TECHNICIAN)
  update(@Param('id') id: number, @Body() updateServiceDto: CreateServiceDto) {
    return this.serviceService.update({ ...updateServiceDto, id });
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.TECHNICIAN)
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
