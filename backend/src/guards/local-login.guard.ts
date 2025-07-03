import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LocalLoginGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    if (gqlContext.getType() === 'graphql') {
      const ctx = gqlContext.getContext();
      // Map GraphQL args to req.body for Passport local strategy
      ctx.req.body = {
        ...ctx.req.body,
        ...gqlContext.getArgs(),
      };
      return ctx.req;
    }
    return context.switchToHttp().getRequest();
    
  }
}
