import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes'; // <-- Import the defined routes

export const appConfig: ApplicationConfig = {
  providers: [
    // FIX 1: Provide the Angular Router. This is mandatory for standalone apps
    // and solves the "Cannot GET /login" error by letting Angular handle the route.
    provideRouter(routes), 
    
    // FIX 2: Provide the HttpClient, and use the recommended withFetch() 
    provideHttpClient(withFetch()) 
  ]
};