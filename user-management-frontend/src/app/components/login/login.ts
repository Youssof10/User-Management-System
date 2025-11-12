import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms'; // <-- NEW: Reactive Forms Imports
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Credentials } from '../../models/user.model'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- NEW: Use Reactive Forms Module
  ],
  templateUrl: 'login.html',
  styleUrls: ['login.css']
})
export class LoginComponent implements OnInit {
  // Replace the old 'model' with a FormGroup
  public loginForm!: FormGroup;
  
  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  // Dependency Injection: Inject FormBuilder
  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder // <-- Inject FormBuilder
  ) {}

  // Lifecycle hook to initialize the form
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Convenience getter for easy access to form controls in the template
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm?.controls || {};
  }

  /**
   * Called when the login form is submitted.
   */
  public onLoginSubmit(): void {
    // 1. Check form validity
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;

    // 2. Get data from the FormGroup
    const credentials: Credentials = this.loginForm.value;

    // Call the service method
    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('Login successful! User:', user);
        
        // Navigate to the protected profile page
        this.router.navigate(['/profile']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      }
    });
  }

  /**
   * Helper to navigate to the registration page.
   */
  public goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
