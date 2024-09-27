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
import { lastValueFrom } from 'rxjs';
import { BackendService } from '../services/backend.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    HttpClientModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'], // Ensure this is 'styleUrls'
})
export class SignupComponent {
  public signupForm: FormGroup;

  constructor(private _backendService: BackendService, private router: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
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
  }

  async signup() {
    this.signupForm.updateValueAndValidity();
    if (!this.signupForm.valid) return;

    try {
      const res = await lastValueFrom(
        this._backendService.postApiCall('/auth/sign-up', {
          ...this.signupForm.value,
        })
      );
      if (res.success) {
        this.router.navigate(['/auth/login']);
      }
      console.log(res);
    } catch (error) {
      console.error('Signup error:', error);
    }
  }

  static validateConfirmPassword() {
    return (control: FormControl): ValidationErrors | null => {
      const passwordControl = control.parent?.get('password') as FormControl;
      if (!passwordControl) return null;

      return control.value === passwordControl.value
        ? null
        : { validateConfirmPassword: false };
    };
  }

  get controls() {
    return this.signupForm.controls;
  }
}
