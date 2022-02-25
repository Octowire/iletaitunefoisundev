import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, switchMap, tap, throwError} from 'rxjs';
import {
  AuthenticatorService,
  REFRESH_TOKEN_TOKEN,
} from '@app/core/security/authenticator.service';
import { AUTHENTICATOR_STRATEGY } from '@app/core/security/strategy/authenticator-strategy';
import {
  Token,
  TokenAuthenticatorStrategy,
} from '@app/core/security/strategy/token-authenticator-strategy';
import { RefreshTokenInterface } from '@app/core/security/strategy/interfaces';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authenticator: AuthenticatorService,
    @Inject(AUTHENTICATOR_STRATEGY)
    private tokenStrategy: TokenAuthenticatorStrategy,
    @Inject(REFRESH_TOKEN_TOKEN)
    private refreshToken: RefreshTokenInterface<Partial<Token>>
  ) {}

  private isRefreshing = false;
  private tokenSubject: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(
    null
  );

  private static addToken(
    request: HttpRequest<unknown>,
    token: string | null
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // make here logic for different strategy
    if (this.tokenStrategy && this.tokenStrategy.getToken()) {
      request = AuthInterceptor.addToken(
        request,
        this.tokenStrategy.getToken()
      );
    }

    return next.handle(request).pipe(
      catchError((err): Observable<never> => {
        if (err.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          this.tokenSubject.next(null);

          this.authenticator.isLoggedIn$().pipe(
            tap((isLoggedIn) => {
              if (isLoggedIn) {
                return this.refreshToken.refresh(this.tokenStrategy.getToken()).pipe(
                  switchMap(token: any) => {
                    this.isRefreshing = false;
                    this.tokenSubject.next(token);
                    return  next handle(AuthInterceptor.addToken(request, token))
                }
                )
              } else {
                this.authenticator.logoutAndRedirectToLogin();
              }
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
