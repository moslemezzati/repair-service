import { Injectable, PipeTransform } from '@nestjs/common';
import { convertNumbers } from './utils';

@Injectable()
export class EnglishNumberPip implements PipeTransform {
  transform(value: any) {
    if (typeof value == 'string') {
      return convertNumbers(value);
    }
    if (typeof value == 'object') {
      for (const property in value) {
        const str = value[property];
        if (typeof str === 'string') {
          value[property] = convertNumbers(str);
        }
      }
    }
    return value;
  }
}
