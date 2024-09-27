import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { BackendService } from '../services/backend.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { of, throwError } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import for animations
import { BackendResponse } from '../../models/interfaces';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let backendService: jasmine.SpyObj<BackendService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create a spy for BackendService
    backendService = jasmine.createSpyObj('BackendService', ['postApiCall']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule, // Use HttpClientTestingModule
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        BrowserAnimationsModule, // Add this for animations
        LoginComponent, // Import the standalone component
      ],
      providers: [
        { provide: BackendService, useValue: backendService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on successful login', async () => {
    const formValue = { email: 'test@example.com', password: 'password' };
    const mockResponse: BackendResponse = {
      success: true,
      message: 'Successfull',
      data: {},
    }; // Ensure this matches BackendResponse structure

    // Set up the postApiCall method to return an observable
    backendService.postApiCall.and.returnValue(of(mockResponse));

    // Simulate form submission
    await component.login({ value: formValue, valid: true } as NgForm);

    expect(backendService.postApiCall).toHaveBeenCalledWith(
      '/auth/login',
      formValue
    );
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should log an error if login fails', async () => {
    const formValue = { email: 'test@example.com', password: 'password' };

    // Set up the postApiCall method to return an error
    backendService.postApiCall.and.returnValue(
      throwError(() => new Error('Login error'))
    );

    const consoleSpy = spyOn(console, 'error'); // Spy on console.error

    // Simulate form submission
    await component.login({ value: formValue, valid: true } as NgForm);

    expect(backendService.postApiCall).toHaveBeenCalledWith(
      '/auth/login',
      formValue
    );
    expect(router.navigate).not.toHaveBeenCalled(); // Should not navigate
    expect(consoleSpy).toHaveBeenCalledWith('Login error:', jasmine.any(Error));
  });

  it('should not call login if form is invalid', async () => {
    const formValue = { email: '', password: '' };

    // Simulate form submission with invalid form
    await component.login({ value: formValue, valid: false } as NgForm);

    expect(backendService.postApiCall).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled(); // Should not navigate
  });
});
