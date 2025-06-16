import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { ERoutePolicies } from '../enums/route-policies.enum';
import { Request } from 'express';
import { TokenUserPayloadDTO } from '../dto/token-payload.dto';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<ERoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    // não precisa de configuração pra rota
    // visto que nenhuma foi configurada
    if (!routePolicyRequired) return true;

    console.log('routePolicyRequired', routePolicyRequired);

    const request = context.switchToHttp().getRequest<Request>();
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY] as
      | TokenUserPayloadDTO
      | undefined;

    if (!tokenPayload)
      throw new UnauthorizedException(
        `This route requires the role: ${routePolicyRequired}. User is not logged`,
      );

    const { user } = tokenPayload;

    if (!user.roles.includes(routePolicyRequired))
      throw new UnauthorizedException(
        `User does not have the required role: ${routePolicyRequired}`,
      );

    return true;
  }
}
