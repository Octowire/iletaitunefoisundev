import { Injectable } from '@angular/core';
import { TokenAuthenticatorStrategy } from '@app/core/security/strategy/token/token-authenticator-strategy';

@Injectable()
export class TokenAuthenticatorStrategyProvider extends TokenAuthenticatorStrategy {}
