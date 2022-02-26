import { BehaviorSubject, Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { Player } from '@app/core/models';
import { TokenAuthenticatorStrategy } from '@app/core/security/strategy/token/token-authenticator-strategy';
import { TokenAuthenticatorData } from '@app/core/security/strategy/token/interfaces/token-authenticator-data';
import { TokenAuthenticatorStrategyProvider } from '@app/core/security/strategy/token/token-authenticator-strategy-provider';

export interface AuthenticatorStrategy<T> {
  onLoginPlayer(data: T): void;

  onLogoutPlayer(): void;

  getCurrentPlayer(): Observable<Player>;

  getCurrentPlayerSubject(): BehaviorSubject<Player>;
}

export const AUTHENTICATOR_STRATEGY =
  new InjectionToken<TokenAuthenticatorData>('authenticator_strategy_token');

export const AUTHENTICATOR_STRATEGY_PROVIDER = {
  provide: TokenAuthenticatorStrategyProvider,
  useClass: TokenAuthenticatorStrategy,
};
