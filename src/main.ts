import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Document')
    .setDescription('The document API description')
    .setVersion('1.0')
    .addTag('Repair Service')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(morgan('dev'));
  app.enableCors();
  app.useGlobalPipes(
    new I18nValidationPipe(),
    new ValidationPipe({ transform: true, whitelist: true }),
  );
  app.useGlobalFilters(new I18nValidationExceptionFilter({detailedErrors: false}));
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
