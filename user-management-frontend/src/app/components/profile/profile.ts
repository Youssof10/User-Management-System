import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs'; // For managing the subscription

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: 'profile.html',
  styleUrls: ['profile.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser$ observable from the AuthService.
    // This allows the component to react to login, logout, and initial session loading.
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      
      // If the user logs out (user becomes null), this ensures they are redirected 
      // even if they are somehow still on the profile page.
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Handles the logout process.
   */
  public onLogout(): void {
    console.log('Logging out...');
    this.authService.logout();
    // The subscription in ngOnInit automatically handles the final navigation after logout.
  }

  ngOnDestroy(): void {
    // Important: Always clean up subscriptions to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}