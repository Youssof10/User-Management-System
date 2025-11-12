import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // <-- Import platform check utility
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs'; // <-- Added 'map' operator
import { User, Credentials, AuthResponse, RegistrationData } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  
  // State management for the current user
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // Inject PLATFORM_ID to determine where the application is running (server or browser)
  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // <-- Inject platform ID
  ) {
    // Load state immediately when the service initializes
    this.loadUserState();
  }

  /**
   * Safely loads the user state from localStorage only if running in a browser.
   * This fixes the 'localStorage is not defined' error during SSR/bootstrapping.
   */
  private loadUserState(): void {
    if (isPlatformBrowser(this.platformId)) { // <-- Check if running in browser
      const token = localStorage.getItem('authToken');
      const userJson = localStorage.getItem('currentUser');
      
      if (token && userJson) {
        try {
          const user: User = JSON.parse(userJson);
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Failed to parse user data from localStorage:', e);
          // Clear invalid data
          this.clearStorage();
        }
      } else {
        this.clearStorage();
      }
    }
  }
  
  /**
   * Utility to clear localStorage safely.
   */
  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) { // <-- Check if running in browser
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Safely gets the token from localStorage if in a browser environment.
   */
  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) { // <-- Check if running in browser
      return localStorage.getItem('authToken');
    }
    return null; // Return null if not in browser
  }

  /**
   * Handles user login API call.
   * Now returns Observable<User>.
   */
  public login(credentials: Credentials): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Save token and user data on successful login (if in browser)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        }
        
        // Update the BehaviorSubject to notify subscribers
        this.currentUserSubject.next(response.data.user);
      }),
      // FIX: Map the AuthResponse to just the User object before returning
      map(response => response.data.user) // <-- FIX APPLIED
    );
  }

  /**
   * Handles user registration API call.
   * Now returns Observable<User>.
   */
  public register(registrationData: RegistrationData): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registrationData).pipe(
      // FIX: Map the AuthResponse to just the User object before returning
      map(response => response.data.user) // <-- FIX APPLIED
      // Note: We don't log in automatically after register, 
      // the RegisterComponent redirects to the LoginComponent.
    );
  }

  /**
   * Logs the user out by clearing local storage and state, and navigating.
   */
  public logout(): void {
    this.clearStorage();
    this.router.navigate(['/login']);
  }
}