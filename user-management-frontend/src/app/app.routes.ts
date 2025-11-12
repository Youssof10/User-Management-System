import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { authGuard } from './guards/auth.guard'; // 1. Import the Auth Guard

// 2. Import a placeholder for the component we are about to create
// NOTE: We will replace this with the actual component soon.
import { ProfileComponent } from './components/profile/profile'; 

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    
    // 3. NEW PROTECTED ROUTE
    { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [authGuard] // <-- THIS APPLIES THE GUARD
    },

    // Redirect to login if path is empty
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    // Catch-all for unknown routes (optional, but good practice)
    { path: '**', redirectTo: '/login' }
];