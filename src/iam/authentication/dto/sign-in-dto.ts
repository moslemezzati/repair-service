import { IsMobilePhone, MinLength } from 'class-validator';

export class SignInDto {
  @IsMobilePhone('fa-IR')
  mobile: string;
  @MinLength(8)
  password: string;
}
