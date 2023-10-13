import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

const persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

function convertNumbers(input) {
  for (const property in input) {
    let str = input[property];
    if (typeof str === 'string') {
      for (let i = 0; i < 10; i++) {
        str = str
          .replace(persianNumbers[i], i.toString())
          .replace(arabicNumbers[i], i.toString());
      }
      input[property] = str;
    }
  }

  return input;
}

@Injectable()
export class EnglishNumberPip implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return convertNumbers(value);
  }
}
