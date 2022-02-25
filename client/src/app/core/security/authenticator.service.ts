import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  AUTHENTICATOR_STRATEGY,
  AuthenticatorStrategy,
} from '@app/core/security/strategy/authenticator-strategy';
import { Credentials } from '@app/core/models';
import { Observable, tap } from 'rxjs';
import { Token } from '@app/core/security/strategy/token-authenticator-strategy';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatorService {
  public readonly LOGIN_PATH = '/api/security/login';

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
}
