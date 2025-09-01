import { User } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  // user and response are obtained from the decorators
  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id
    }

    const expires = new Date()
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    )

    const token = this.jwtService.sign(tokenPayload)

    response.cookie('Authentication', token, {
      httpOnly: true, // only available for http requests, not for client-side javascript
      expires
    })
  }

}
