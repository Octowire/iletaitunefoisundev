import { Inject, Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import {
  AuthenticatorService,
  REFRESH_TOKEN_TOKEN,
} from '@app/core/security/authenticator.service';
import { AUTHENTICATOR_STRATEGY } from '@app/core/security/strategy/authenticator-strategy';
import { TokenAuthenticatorStrategy } from '@app/core/security/strategy/token-authenticator-strategy';
import { RefreshTokenInterface } from '@app/core/security/strategy/interfaces';
import { SecurityToken } from '@app/core/security/strategy/interfaces/security-token';
import { AuthToken } from '@app/core/security/strategy/interfaces/auth-token';
import { RefreshToken } from '@app/core/security/strategy/interfaces/refresh-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authenticator: AuthenticatorService,
    @Inject(AUTHENTICATOR_STRATEGY)
    private tokenStrategy: TokenAuthenticatorStrategy,
    @Inject(REFRESH_TOKEN_TOKEN)
    private refreshToken: RefreshTokenInterface<RefreshToken, SecurityToken>
  ) {}

  private isRefreshing = false;
  private tokenSubject: BehaviorSubject<AuthToken> =
    new BehaviorSubject<AuthToken>({} as AuthToken);

  private static addToken(
    request: HttpRequest<unknown>,
    authToken: AuthToken
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken.token}`,
      },
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api/security/login')) {
      return next.handle(request);
    }

    if (this.tokenStrategy && this.tokenStrategy.hasToken()) {
      request = AuthInterceptor.addToken(
        request,
        this.tokenStrategy.getToken()
      );
    }

    return next.handle(request).pipe(
      catchError((err): Observable<never> => {
        if (err.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          this.tokenSubject.next({} as AuthToken);

          this.authenticator.isLoggedIn$().pipe(
            tap((isLoggedIn) => {
              if (isLoggedIn) {
                return this.refreshToken
                  .refresh(this.tokenStrategy.getRefreshToken())
                  .pipe(
                    switchMap((token: AuthToken) => {
                      this.isRefreshing = false;
                      this.tokenSubject.next(token);
                      return next.handle(
                        AuthInterceptor.addToken(request, token)
                      );
                    }),
                    catchError(() => {
                      this.isRefreshing = false;
                      this.authenticator.logoutAndRedirectToLogin();
                      return EMPTY;
                    })
                  );
              } else {
                return this.tokenSubject.pipe(
                  filter((authToken: AuthToken) => authToken.token !== null),
                  take(1),
                  switchMap((authToken: AuthToken) =>
                    next.handle(AuthInterceptor.addToken(request, authToken))
                  )
                );
              }
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}

export const AUTH_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
