import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '@shared/shared.module';
import { AUTHENTICATOR_STRATEGY_PROVIDER } from '@app/core/security/strategy/authenticator-strategy';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, SecurityRoutingModule, SharedModule],
  providers: [AUTHENTICATOR_STRATEGY_PROVIDER],
})
export class SecurityModule {}
