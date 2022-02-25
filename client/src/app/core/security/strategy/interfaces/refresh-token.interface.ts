import { Observable } from 'rxjs';

export interface RefreshTokenInterface<T> {
  refresh(data: T): Observable<T>;
}
