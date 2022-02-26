import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AUTHENTICATOR_STRATEGY,
  AuthenticatorStrategy,
} from '@app/core/security/strategy/authenticator-strategy';
import { Credentials } from '@app/core/models';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Token } from '@app/core/security/strategy/token-authenticator-strategy';
import {
  LoginInterface,
  RefreshTokenInterface,
} from '@app/core/security/strategy/interfaces';
import { SecurityToken } from '@app/core/security/strategy/interfaces/security-token';
import { RefreshToken } from '@app/core/security/strategy/interfaces/refresh-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorService
  implements
    LoginInterface<Token>,
    RefreshTokenInterface<RefreshToken, SecurityToken>
{
  public readonly LOGIN_PATH = '/api/security/login';
  private readonly REFRESH_TOKEN_URL = '/api/security/token-refresh';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(AUTHENTICATOR_STRATEGY)
    private authenticator: AuthenticatorStrategy<unknown>
  ) {}

  login(credentials: Credentials): Observable<Token> {
    return this.httpClient
      .post<Token>(this.LOGIN_PATH, credentials, {
        withCredentials: true,
      })
      .pipe(tap((data: Token) => this.authenticator.onLoginPlayer(data)));
  }

  logout(): void {
    return this.doLogoutUser();
  }

  logoutAndRedirectToLogin(): void {
    this.doLogoutUser();
    this.router.navigate([this.LOGIN_PATH]);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.authenticator.getCurrentPlayer().pipe(
      map((user) => !!user),
      catchError(() => of(false))
    );
  }

  private doLogoutUser(): void {
    this.authenticator.onLogoutPlayer();
  }

  refresh(refreshToken: RefreshToken): Observable<SecurityToken> {
    return this.httpClient
      .post<Token>(this.REFRESH_TOKEN_URL, refreshToken.refreshToken)
      .pipe(
        tap((token: Token) => {
          this.authenticator.onLoginPlayer(token);
        })
      );
  }
}

export const LOGIN_TOKEN = new InjectionToken<LoginInterface<Token>>(
  'app.security.login'
);

export const REFRESH_TOKEN_TOKEN = new InjectionToken<
  RefreshTokenInterface<RefreshToken, SecurityToken>
>('app.security.refresh_token');

export const LOGIN_PROVIDER: Provider = {
  provide: LOGIN_TOKEN,
  useClass: AuthenticatorService,
};

export const REFRESH_TOKEN_PROVIDER: Provider = {
  provide: REFRESH_TOKEN_TOKEN,
  useClass: AuthenticatorService,
};
