import { BehaviorSubject, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from '@app/core/models';
import { TokenAuthenticatorStrategy } from '@app/core/security/strategy/token-authenticator-strategy';

export interface AuthenticatorStrategy<T> {
  onLoginPlayer(data: T): void;

  onLogoutPlayer(): void;

  getCurrentPlayer(): Observable<Player>;

  getCurrentPlayerSubject(): BehaviorSubject<Player>;
}

export const AUTHENTICATOR_STRATEGY = new InjectionToken<
  AuthenticatorStrategy<unknown>
>('authenticator_strategy_token');

export const AUTHENTICATOR_STRATEGY_PROVIDER = {
  provide: AUTHENTICATOR_STRATEGY,
  deps: [HttpClient],
  useFactory: (): TokenAuthenticatorStrategy => {
    /*
     * Make multi provider for log like JWT, Cookie or Fake
     */
    return new TokenAuthenticatorStrategy();
  },
};
