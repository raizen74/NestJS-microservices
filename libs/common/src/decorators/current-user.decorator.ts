import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@app/common';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument | undefined => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  // context is graphql, grab the user from the header, set it gateway.module.ts
  const user = context.getArgs()[2]?.req.headers?.user;
  if (user) {
    return JSON.parse(user);
  }
  return;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
