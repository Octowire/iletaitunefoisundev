import { TestBed } from '@angular/core/testing';

import { API_INTERCEPTOR_PROVIDER } from './api.interceptor';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { environment } from '@env/environment';

describe('ApiInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [API_INTERCEPTOR_PROVIDER],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(
      HttpTestingController as Type<HttpTestingController>
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add api url to http request', () => {
    // Act
    httpClient.get('/quest').subscribe();

    // Assert
    httpMock.expectOne({ url: environment.apiUrl + '/quest' });
  });

  it('should not add api url to http request', () => {
    // Act
    httpClient.get('http://localhost:8080/quest').subscribe();

    // Assert
    httpMock.expectOne({ url: 'http://localhost:8080/quest' });
  });
});
