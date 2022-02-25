import { AuthenticatorStrategy } from '@app/core/security/strategy/authenticator-strategy';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '@app/core/models';

export class TokenAuthenticatorStrategy
  implements AuthenticatorStrategy<Token>
{
  private readonly JWT_TOKEN = 'OCTOPUS_TOKEN';

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
  }

  onLogoutPlayer(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }
}

export class Token {
  constructor(public token: string) {}
}
