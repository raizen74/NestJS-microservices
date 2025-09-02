import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
  UserDocument,
} from '@app/common';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@AuthServiceControllerMethods() // provides metadata to our function, so incoming messages on this controller go to the correct function
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // if it passes, the user is valid
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response, // passthrough: true -> response is sent manually within the route handler
  ) {
    // modifies the response object, injecting the JWT
    await this.authService.login(user, response);
    response.send(user); // send the response back on the response object
  }

  @UseGuards(JwtAuthGuard) // jwt.strategy.ts returns the user
  async authenticate(data: any) {
    return {
      ...data.user,
      id: data.user._id //GRPC are not allowed in GRPC
    }
  }
}
