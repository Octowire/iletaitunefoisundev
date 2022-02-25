import { AuthenticatorStrategy } from '@app/core/security/strategy/authenticator-strategy';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '@app/core/models';

export interface TokenAuthenticatorData {
  getToken(): AuthToken;
  getRefreshToken(): RefreshToken;
  hasToken(): boolean;
  hasRefreshToken(): boolean;
}

export class TokenAuthenticatorStrategy
  implements AuthenticatorStrategy<Token>, TokenAuthenticatorData
{
  private readonly JWT_TOKEN = 'OCTOPUS_TOKEN';
  private readonly JWT_REFRESH_TOKEN = 'OCTOPUS_REFRESH_TOKEN';

  getCurrentPlayer(): Observable<Player> {
    return this.getCurrentPlayerSubject().asObservable();
  }

  getCurrentPlayerSubject(): BehaviorSubject<Player> {
    const authToken: AuthToken = this.getToken();

    if (authToken.token) {
      const encodePayload = authToken.token.split('.')[1];
      const payload = window.atob(encodePayload);
      return new BehaviorSubject<Player>(JSON.parse(payload).username);
    }

    // @ts-ignore only for fast checking !!user
    return new BehaviorSubject<Player>(false);
  }

  onLoginPlayer(data: SecurityToken): void {
    if (typeof data.token === 'string') {
      localStorage.setItem(this.JWT_TOKEN, data.token);
    }
    if (typeof data.refreshToken === 'string') {
      localStorage.setItem(this.JWT_REFRESH_TOKEN, data.refreshToken);
    }
  }

  onLogoutPlayer(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.JWT_REFRESH_TOKEN);
  }

  getToken(): AuthToken {
    return {
      token: localStorage.getItem(this.JWT_TOKEN),
    };
  }

  getRefreshToken(): RefreshToken {
    return {
      refreshToken: localStorage.getItem(this.JWT_REFRESH_TOKEN),
    };
  }

  hasToken(): boolean {
    return this.getToken().token !== null;
  }

  hasRefreshToken(): boolean {
    return this.getRefreshToken().refreshToken !== null;
  }
}

export class Token implements SecurityToken {
  constructor(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
  token: string | null;
  refreshToken: string | null;
}

export interface SecurityToken extends AuthToken, RefreshToken {}

export interface AuthToken {
  token: string | null;
}

export interface RefreshToken {
  refreshToken: string | null;
}
