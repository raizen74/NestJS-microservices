import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@app/common';
import type { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { User } from '.prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)  // if it passes, the user is valid
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({passthrough: true}) response: Response // passthrough: true -> response is sent manually within the route handler
  ) {
    // modifies the response object, injecting the JWT
    await this.authService.login(user, response)
    response.send(user);  // send the response back on the response object
  }

  @UseGuards(JwtAuthGuard)  // jwt.strategy.ts returns the user
  @MessagePattern('authenticate')
  async authenticate(
    @Payload() data: any
  ) {
    return data.user; // return the user to the caller
  }

}
