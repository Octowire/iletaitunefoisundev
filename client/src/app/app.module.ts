import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecurityLayoutComponent } from './layouts/security-layout/security-layout.component';
import { API_INTERCEPTOR_PROVIDER } from '@app/core/interceptors/api.interceptor';

@NgModule({
  declarations: [AppComponent, SecurityLayoutComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [API_INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent],
})
export class AppModule {}
