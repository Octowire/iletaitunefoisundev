import { AuthToken } from '@app/core/security/strategy/interfaces/auth-token';
import { RefreshToken } from '@app/core/security/strategy/interfaces/refresh-token';

export interface TokenAuthenticatorData {
  getToken(): AuthToken;

  getRefreshToken(): RefreshToken;

  hasToken(): boolean;

  hasRefreshToken(): boolean;
}
