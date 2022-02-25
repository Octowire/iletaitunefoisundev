import { AuthenticatorStrategy } from '@app/core/security/strategy/authenticator-strategy';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '@app/core/models';
import { Loggable } from '@app/core/security/authenticator.service';

export interface TokenAuthenticatorData {
  getToken(): string | null;
  getRefreshToken(): string | null;
  getTokens(): Token;
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
    const token = this.getToken();

    if (token) {
      const encodePayload = token.split('.')[1];
      const payload = window.atob(encodePayload);
      return new BehaviorSubject<Player>(JSON.parse(payload).username);
    }

    // @ts-ignore only for fast checking !!user
    return new BehaviorSubject<Player>(false);
  }

  onLoginPlayer(data: Token): void {
    localStorage.setItem(this.JWT_TOKEN, data.token);
    localStorage.setItem(this.JWT_REFRESH_TOKEN, data.refreshToken);
  }

  onLogoutPlayer(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.JWT_REFRESH_TOKEN);
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.JWT_REFRESH_TOKEN);
  }

  getTokens(): Token {
    if (this.getRefreshToken() && this.getToken()) {
      return {
        token: this.getToken()!,
        refreshToken: this.getRefreshToken()!,
      };
    } else return {} as SecurityToken;
  }
}

export class Token implements SecurityToken {
  constructor(token: string, refreshToken: string) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
  token: string;
  refreshToken: string;
}

export interface SecurityToken {
  token: string;
  refreshToken: string;
}
