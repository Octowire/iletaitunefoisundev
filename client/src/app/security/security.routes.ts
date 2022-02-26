import { Routes } from '@angular/router';
import { LoginComponent } from '@app/security/login/login.component';

export const SecurityRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
];
