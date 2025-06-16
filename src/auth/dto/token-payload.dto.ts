import { User } from 'src/users/entities/user.entity';

export class TokenPayloadDTO {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export class TokenUserPayloadDTO extends TokenPayloadDTO {
  user: User;
}
