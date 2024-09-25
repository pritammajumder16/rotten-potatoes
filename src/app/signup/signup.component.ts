import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.required,
      Validators.pattern('^(?=.*[!@#$%^&*(),.?":{}|<>]).+$'),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      SignupComponent.validateConfirmPassword(),
    ]),
  });
  signup() {
    this.signupForm.updateValueAndValidity();
    if (!this.signupForm.valid) return;
  }
  static validateConfirmPassword() {
    return (control: FormControl): ValidationErrors | null => {
      if (!control.parent) return null;
      const passwordControl = control.parent.get('password') as FormControl;
      if (!passwordControl) {
        return {
          validateConfirmPassword: false,
        };
      }
      return control.value == passwordControl?.value
        ? null
        : {
            validateConfirmPassword: false,
          };
    };
  }
  get controls() {
    return this.signupForm.controls;
  }
}
