import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms'; // <-- Added AbstractControl
import { AuthService } from '../../services/auth.service';
import { RegistrationData } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterLink
  ],
  templateUrl: 'register.html',
  styleUrls: ['register.css']
})
export class RegisterComponent implements OnInit {
  public registrationForm!: FormGroup; 

  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', [Validators.required]]
    });
  }

  // Convenience getter that safely returns the controls object, typed to
  // allow the template to access properties without the 'possibly undefined' error.
  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm?.controls || {};
  }

  /**
   * Called when the registration form is submitted.
   */
  public onRegisterSubmit(): void {
    // Check if the form is valid based on the TS validators
    if (this.registrationForm.invalid) {
      // Mark all fields as touched to display errors immediately
      this.registrationForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Get the form data (which matches the RegistrationData interface)
    const userData: RegistrationData = this.registrationForm.value;

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.isLoading = false;
        console.log('Registration successful! User created:', user);

        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}
