import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CompanyModule } from '../company/company.module';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    TypeOrmModule.forFeature([User]),
    IamModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
