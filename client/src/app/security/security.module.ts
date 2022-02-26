import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { SecurityRoutes } from '@app/security/security.routes';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(SecurityRoutes)],
  providers: [],
})
export class SecurityModule {}
