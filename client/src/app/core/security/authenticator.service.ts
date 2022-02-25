import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AUTHENTICATOR_STRATEGY,
  AuthenticatorStrategy,
} from '@app/core/security/strategy/authenticator-strategy';
import { Credentials } from '@app/core/models';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
  Token,
  TokenAuthenticatorStrategy,
} from '@app/core/security/strategy/token-authenticator-strategy';
import {
  LoginInterface,
  RefreshTokenInterface,
} from '@app/core/security/strategy/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorService
  implements LoginInterface<Token>, RefreshTokenInterface<Token>
{
  public readonly LOGIN_PATH = '/api/security/login';
  public readonly LOGOUT_PATH = '/api/security/logout';
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

  refresh(data: Token): Observable<Token> {
    return this.httpClient
      .post<Token>(this.REFRESH_TOKEN_URL, { refreshToken: data.refreshToken })
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
  RefreshTokenInterface<Partial<Token>>
>('app.security.refresh_token');

export const LOGIN_PROVIDER: Provider = {
  provide: LOGIN_TOKEN,
  useClass: AuthenticatorService,
};

export const REFRESH_TOKEN_PROVIDER: Provider = {
  provide: REFRESH_TOKEN_TOKEN,
  useClass: AuthenticatorService,
};
