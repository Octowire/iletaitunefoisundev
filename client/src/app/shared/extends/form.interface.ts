import { FormBuilder, FormGroup } from '@angular/forms';

export interface Form {
  form: FormGroup;
  isSubmitted: boolean;
  errors: [];
}

export class BaseForm implements Form {
  errors: [];
  form: FormGroup;
  isSubmitted: boolean;

  constructor(private formBuilder: FormBuilder) {}

  submit() {
    if (!this.form.valid) {
    }
  }
}
