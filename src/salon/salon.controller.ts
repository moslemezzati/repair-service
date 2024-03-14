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
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';

@Auth(AuthType.Bearer)
@ApiTags('salons')
@Controller('salons')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.STORE_KEEPER)
  create(
    @Body() createSalonDto: CreateSalonDto,
    @ActiveUser() { adminId }: ActiveUserData,
  ) {
    createSalonDto.adminId = adminId;
    return this.salonService.create(createSalonDto);
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
      companyId?: number;
    },
    @ActiveUser() { adminId }: ActiveUserData,
  ) {
    return this.salonService.findAll({ ...query, adminId });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  findOne(@Param('id') id: string) {
    return this.salonService.findOne(+id);
  }

  @Patch(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.STORE_KEEPER)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateSalonDto) {
    return this.salonService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.STORE_KEEPER)
  remove(@Param('id') id: string) {
    return this.salonService.remove(+id);
  }
}
