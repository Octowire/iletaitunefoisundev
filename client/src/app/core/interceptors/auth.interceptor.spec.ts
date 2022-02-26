import { TestBed } from '@angular/core/testing';

import { AUTH_INTERCEPTOR_PROVIDER } from './auth.interceptor';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  AUTHENTICATOR_STRATEGY,
  AUTHENTICATOR_STRATEGY_PROVIDER,
} from '@app/core/security/strategy/authenticator-strategy';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LOGIN_ROUTE } from '@app/security/login/login.component';
import { RefreshTokenInterface } from '@app/core/security/strategy/token/interfaces';
import {
  REFRESH_TOKEN_PROVIDER,
  REFRESH_TOKEN_TOKEN,
} from '@app/core/security/authenticator.service';
import { of } from 'rxjs';
import { TokenAuthenticatorData } from '@app/core/security/strategy/token/interfaces/token-authenticator-data';
import { SecurityToken } from '@app/core/security/strategy/token/interfaces/security-token';
import { AuthToken } from '@app/core/security/strategy/token/interfaces/auth-token';
import { RefreshToken } from '@app/core/security/strategy/token/interfaces/refresh-token';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let strategy: TokenAuthenticatorData;
  let refreshToken: RefreshTokenInterface<RefreshToken, SecurityToken>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([LOGIN_ROUTE]),
      ],
      providers: [
        AUTH_INTERCEPTOR_PROVIDER,
        AUTHENTICATOR_STRATEGY_PROVIDER,
        REFRESH_TOKEN_PROVIDER,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    strategy = TestBed.inject(AUTHENTICATOR_STRATEGY);
    refreshToken = TestBed.inject(REFRESH_TOKEN_TOKEN);
  });

  describe('when is authenticated', () => {
    beforeEach(() => {
      const authToken: AuthToken = {
        token: 'token',
      };
      const refreshToken: RefreshToken = {
        refreshToken: 'refresh_token',
      };

      spyOn(strategy, 'getToken').and.returnValue(authToken);
      spyOn(strategy, 'getRefreshToken').and.returnValue(refreshToken);
    });

    it('should not add bearer token to Authorization header', () => {
      httpClient.get('/api/security/login').subscribe();
      const request = httpMock.expectOne('/api/security/login');
      expect(request.request.headers.get('Authorization')).toBeNull();
    });

    it('should add bearer token to Authorization header', () => {
      httpClient.get('/api').subscribe();
      const request = httpMock.expectOne('/api');
      expect(request.request.headers.get('Authorization')).toBe('Bearer token');
    });

    it('should add bearer token after refresh to Authorization header', () => {
      const newToken: SecurityToken = {
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NDU3OTc0NDksImV4cCI6MTY0NTgwMTA0OSwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9QTEFZRVIiXSwidXNlcm5hbWUiOiJ1c2VyKzFAZW1haWwuY29tIn0.1IBeVUdMkiJD5z5hlQFNM8OUbWu5v9POe2maoYNoCp83UHQcg9sTrVri-U3l2pWqhrxrjsKQaytFbZuffhmUqlOYP-lf_feDoGZYJjhG-ARtkrEFvyDCPGGCiF30R86i-2l65SWAsByUE6hW2prKUH3ydGVfq_z5gxTAzbL8ekcoL08u_aCoJo7jbD_fsn_mQIaum6l8Gl84Lz3P1OTK4zXtJZZmFRpHhMTcevQBgt2rUvW2Hq4eJZLz0zhUgfgyBU4EUa25oUmiaM_L5sdaEoC9U6vF--Dg4kwwZ7X8fNZCpeTLjDqPj3PndTrBxsnrMTuXAKobDGj-HlQCoRL3FA',
        refreshToken: 'refresh_token',
      };
      spyOn(refreshToken, 'refresh').and.returnValue(of(newToken));
      httpClient.get('/api').subscribe();
      const request = httpMock.expectOne('/api');
      request.flush('', { status: 401, statusText: 'JWT expired' });
      expect(request.request.headers.get('Authorization')).toBe('Bearer token');
    });
  });
});
