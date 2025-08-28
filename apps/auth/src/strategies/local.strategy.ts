import { Injectable, UnauthorizedException } from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport"
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({usernameField: 'email'}); // pass a different field to check the usernameField on, in this case "email"
  }

  // we must implement this abstract method
  async validate(email: string, password: string) {
    try {
      return this.usersService.verifyUser(email, password);  // what is returned by verifyUser is automatically added to the request object (we return user)
    } catch(err) {
      throw new UnauthorizedException(err)
    }
  }
}