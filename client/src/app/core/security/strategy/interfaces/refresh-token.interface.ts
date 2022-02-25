import { Observable } from 'rxjs';

export interface RefreshTokenInterface<T, U> {
  refresh(refreshToken: T): Observable<U>;
}
