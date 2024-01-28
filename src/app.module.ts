import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { DeviceModule } from './device/device.module';
import { EnglishNumberPip } from './englishNumber.pip';
import { HttpExceptionFilter, SQLExceptionFilter } from './exception.filters';
import { IamModule } from './iam/iam.module';
import { ItemModule } from './item/item.module';
import { MessageModule } from './message/message.module';
import { SalonModule } from './salon/salon.module';
import { ServiceModule } from './service/service.module';
import { UsersModule } from './users/users.module';

// type: 'mysql',
// host: 'localhost',
// port: 3306,
// username: 'ftoolir1_repair',
// password: '@ah367Zaf*IVB8',
// database: 'ftoolir1_repair',

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
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
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
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: EnglishNumberPip,
    },
  ],
})
export class AppModule {}
