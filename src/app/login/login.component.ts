import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackendService } from '../services/backend.service';
import { lastValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Change to styleUrls
})
export class LoginComponent {
  constructor(
    private _backendService: BackendService,
    private router: Router
  ) {}

  async login(form: NgForm) {
    console.log(form.value);
    if (!form.valid) return;

    try {
      const res = await lastValueFrom(
        this._backendService.postApiCall('/auth/login', { ...form.value })
      );
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Login error:', error);
    }
  }
}
