import { BehaviorSubject, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from '@app/core/models';
import {
  TokenAuthenticatorData,
  TokenAuthenticatorStrategy,
} from '@app/core/security/strategy/token-authenticator-strategy';

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
  useClass: TokenAuthenticatorStrategy,
};
