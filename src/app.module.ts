import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { ItemModule } from './item/item.module';
import { ServiceModule } from './service/service.module';
import { MessageModule } from './message/message.module';
import {
  MessageExceptionFilter,
  SQLExceptionFilter,
} from './exception.filters';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { EnglishNumberPip } from './englishNumber.pip';
import { DeviceModule } from './device/device.module';
import { SalonModule } from './salon/salon.module';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';

// type: 'mysql',
// host: 'localhost',
// port: 3306,
// username: 'ftoolir_repair',
// password: '@ah367Zaf*IVB8',
// database: 'ftoolir_repair',

@Module({
  imports: [
    ConfigModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'fa',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'repair',
      autoLoadEntities: true,
      synchronize: true,
      logging: 'all',
    }),
    UsersModule,
    IamModule,
    CompanyModule,
    ItemModule,
    ServiceModule,
    MessageModule,
    DeviceModule,
    SalonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: SQLExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MessageExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: EnglishNumberPip,
    },
  ],
})
export class AppModule {}
