import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Credential } from '@app/core/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<ControlsOf<Credential>> = new FormGroup<
    ControlsOf<Credential>
  >({
    email: new FormControl<Credential['email']>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<Credential['password']>('', [
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

  onSubmit();
}
