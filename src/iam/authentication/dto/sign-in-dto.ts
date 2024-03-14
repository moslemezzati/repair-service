import { IsMobilePhone, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInDto {
  @IsMobilePhone(
    'fa-IR',
    {},
    { message: i18nValidationMessage('validation.mobile') },
  )
  mobile: string;
  @MinLength(8, { message: i18nValidationMessage('validation.passwordLength') })
  password: string;
}
