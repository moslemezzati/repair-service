import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto) {
    const { mobile, password: pass } = data;
    const user = await this.usersService.findUser(mobile, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...payload } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
      ...payload,
    };
  }
}
