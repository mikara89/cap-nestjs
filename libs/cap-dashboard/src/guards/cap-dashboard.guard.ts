import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

// Token name used to register the user-provided guard provider in the module
const USER_GUARD_TOKEN = 'CAP_DASHBOARD_USER_GUARD';

@Injectable()
export class CapDashboardGuard implements CanActivate {
  constructor(@Inject(USER_GUARD_TOKEN) private readonly userGuard: any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.userGuard) return false;
    // If the user guard is a class provider with canActivate, call it.
    if (typeof this.userGuard.canActivate === 'function') {
      const result = this.userGuard.canActivate(context);
      return result instanceof Promise ? await result : !!result;
    }
    // If the provider was a factory returning a function
    if (typeof this.userGuard === 'function') {
      const res = this.userGuard(context);
      return res instanceof Promise ? await res : !!res;
    }
    return false;
  }
}
