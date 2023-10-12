import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { ItemModule } from './item/item.module';
import { ServiceModule } from './service/service.module';
import { MessageModule } from './message/message.module';
import { SQLExceptionFilter } from './exception.filters';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

//password: @ah367Zaf*IVB8
@Module({
  imports: [
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
    AuthModule,
    CompanyModule,
    ItemModule,
    ServiceModule,
    MessageModule,
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
      useClass: SQLExceptionFiler,
    },
  ],
})
export class AppModule {}
