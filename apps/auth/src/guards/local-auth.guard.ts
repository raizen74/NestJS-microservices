import { AuthGuard } from "@nestjs/passport";

export class LocalAuthGuard extends AuthGuard('local') {  // passing local strategy as string
  
}