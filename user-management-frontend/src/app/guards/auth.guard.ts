import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard (CanActivateFn)
 *
 * This function determines if a route can be activated (accessed).
 * It checks if a valid JWT token exists in the AuthService.
 * If the token exists, access is granted (returns true).
 * If the token is missing, the user is redirected to the login page (returns false).
 */
export const authGuard: CanActivateFn = (route, state) => {
  // Use Angular's 'inject' function to get instances of services inside a function
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check the AuthService for the presence of the JWT token
  if (authService.getToken()) {
    // Token exists, user is logged in. Allow access to the route.
    return true;
  } else {
    // Token does not exist. Redirect the user to the login page.
    console.log("Access denied. Redirecting to login.");
    router.navigate(['/login']);
    
    // Block the navigation attempt.
    return false;
  }
};