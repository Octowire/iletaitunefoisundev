import { SecurityToken } from '@app/core/security/strategy/token/interfaces/security-token';

export class Token implements SecurityToken {
  constructor(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
  token: string | null;
  refreshToken: string | null;
}
