import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Credentials } from '@app/core/models';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<ControlsOf<Credentials>> = new FormGroup<
    ControlsOf<Credentials>
  >({
    email: new FormControl<Credentials['email']>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<Credentials['password']>('', [
      Validators.required,
    ]),
  });
  isSubmitted = false;
  errors = [];
  returnUrl = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['return'] || '/';
  }

  onSubmit(): void {}
}

export const LOGIN_ROUTE: Route = {
  path: 'logins',
  component: LoginComponent,
};
