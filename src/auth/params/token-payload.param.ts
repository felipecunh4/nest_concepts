import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { TokenUserPayloadDTO } from '../dto/token-payload.dto';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    return request[REQUEST_TOKEN_PAYLOAD_KEY] as
      | TokenUserPayloadDTO
      | undefined;
  },
);
