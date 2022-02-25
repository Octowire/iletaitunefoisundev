import { Credentials } from '@app/core/models';
import { Observable } from 'rxjs';

export interface LoginInterface<T> {
  login(credentials: Credentials): Observable<T>;
}
