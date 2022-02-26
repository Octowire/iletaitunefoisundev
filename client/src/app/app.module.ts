import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecurityLayoutComponent } from './layouts/security-layout/security-layout.component';
import { API_INTERCEPTOR_PROVIDER } from '@app/core/interceptors/api.interceptor';
import { AUTH_INTERCEPTOR_PROVIDER } from '@app/core/interceptors/auth.interceptor';
import { AUTHENTICATOR_STRATEGY_PROVIDER } from '@app/core/security/strategy/authenticator-strategy';

@NgModule({
  declarations: [AppComponent, SecurityLayoutComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    API_INTERCEPTOR_PROVIDER,
    AUTH_INTERCEPTOR_PROVIDER,
    AUTHENTICATOR_STRATEGY_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
