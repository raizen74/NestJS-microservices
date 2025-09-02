import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(
    // Injection token
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,  // parameter property
    private readonly reflector: Reflector,  // parameter property
  ) {}
  // Set the service we want
  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
  }

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

    return this.authService.authenticate({  // Call gRPC authenticate method
        Authentication: jwt,
      }) // receives the user
      .pipe(
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                this.logger.error('User does not have valid roles.');
                throw new UnauthorizedException();
              }
            }
          }
          context.switchToHttp().getRequest().user = {
            ...res,
            _id: res.id, // gRPC cannot use _
          };
        }),
        map(() => true), // can pass
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
