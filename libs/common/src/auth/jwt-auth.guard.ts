import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@app/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../models';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  // ClientProxy allow us to connect with other microservices via the provided transport layer
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // cookie-parser library is resposible for creating the cookies property of the request object
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
      // if no jwt, reject the request
      return false;
    }

    // Get the roles assigned to this route handler e.g. in reservations.controller @Roles
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      }) // receives the user
      .pipe(
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.map((role: Role) => role.name).includes(role)) {
                this.logger.error('User does not have valid roles.');
                throw new UnauthorizedException();
              }
            }
          }
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true), // can pass
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
