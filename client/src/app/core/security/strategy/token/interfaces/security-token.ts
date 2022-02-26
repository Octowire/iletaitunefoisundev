import { AuthToken } from '@app/core/security/strategy/token/interfaces/auth-token';
import { RefreshToken } from '@app/core/security/strategy/token/interfaces/refresh-token';

export interface SecurityToken extends AuthToken, RefreshToken {}
