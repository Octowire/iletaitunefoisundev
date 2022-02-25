import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityLayoutComponent } from '@app/layouts/security-layout/security-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/security/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SecurityLayoutComponent,
    loadChildren: () =>
      import('./security/security.module').then((m) => m.SecurityModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
