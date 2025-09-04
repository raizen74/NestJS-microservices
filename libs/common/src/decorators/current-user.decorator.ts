import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../interfaces";

const getCurrentUserByContext = (context: ExecutionContext): User => {
 // what is returned by verifyUser is automatically added to the request object (in this case user)
 // and is automatically accessible, so we can extract it
  return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_data:unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)