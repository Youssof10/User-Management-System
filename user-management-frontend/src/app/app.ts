import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Provides @if, @for, etc.
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import for template-driven forms

@Component({
  selector: 'app-root',
  standalone: true, // <-- Mark component as standalone
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule // <-- Import FormsModule here
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'user-management-frontend';
}

