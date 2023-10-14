import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(QueryFailedError)
export class SQLExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message =
      this.duplicateErrorMessage(exception.message) || exception.message;
    const statusCode = 500;
    Logger.error(exception);
    response.status(statusCode).json({
      error: this.i18n.t(message),
    });
  }

  duplicateErrorMessage(errorMessage: string): string {
    const regex = /Duplicate entry '(.+?)' for key '(.+?)'/;
    const match = errorMessage.match(regex);
    if (match) {
      return this.i18n.t(`errors.duplicatedRecord`);
    }
    return errorMessage;
  }
}

@Catch()
export class MessageExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const response = host.switchToHttp().getResponse<any>();

    const errorMessage: string[] = [];
    const exceptionResponse = exception.getResponse() as { message: string[] };

    if (typeof exceptionResponse == 'object') {
      const { message } = exceptionResponse;
      if (Array.isArray(message)) {
        for (const msg of message) {
          errorMessage.push(i18n.t('errors.' + msg));
        }
      } else {
        errorMessage.push(message);
      }
    } else {
      errorMessage.push(i18n.t('errors.' + exceptionResponse));
    }
    response.status(exception.getStatus()).send(errorMessage);
  }
}
