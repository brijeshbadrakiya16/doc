import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper flex items-center justify-center">
      <div class="card auth-card">
        <div class="auth-header text-center">
          <div class="auth-logo-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your DocVault Enterprise workspace</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label class="form-label" for="email">Work Email</label>
            <div class="input-with-icon">
              <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                class="form-input with-left-icon"
                [(ngModel)]="credentials.email"
                required
                email
                #emailInput="ngModel"
                placeholder="name@company.com"
                autocomplete="email"
              />
            </div>
            <div *ngIf="emailInput.invalid && emailInput.touched" class="form-error">
              Please enter a valid business email address.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="input-with-icon">
              <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                class="form-input with-left-icon with-right-btn"
                [(ngModel)]="credentials.password"
                required
                #passwordInput="ngModel"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-password-btn"
                (click)="showPassword = !showPassword"
                [title]="showPassword ? 'Hide password' : 'Show password'"
                tabindex="-1"
              >
                <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <div *ngIf="passwordInput.invalid && passwordInput.touched" class="form-error">
              Password is required.
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            [disabled]="loginForm.invalid || isLoading"
            style="margin-top: 1.5rem;"
          >
            <span *ngIf="!isLoading" class="flex items-center gap-2">
              <span>Sign In to Account</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
            <span *ngIf="isLoading" class="flex items-center gap-2">
              <span class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></span>
              <span>Authenticating...</span>
            </span>
          </button>
        </form>

        <div class="auth-footer text-center">
          Don't have an enterprise account?
          <a routerLink="/signup" class="auth-switch-link">Create one now</a>
        </div>
        <div class="auth-back text-center">
          <a routerLink="/" class="back-link flex items-center justify-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Public Overview</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
      padding: 2rem 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .auth-header { margin-bottom: 2rem; }
    .auth-logo-badge {
      width: 56px;
      height: 56px;
      margin: 0 auto 1rem;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
    }
    .auth-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-dark-neutral); letter-spacing: -0.025em; margin-bottom: 0.25rem; }
    .auth-header p { font-size: 0.875rem; color: var(--color-text-secondary); }
    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }
    .field-icon {
      position: absolute;
      left: 0.875rem;
      color: #94a3b8;
      pointer-events: none;
    }
    .form-input.with-left-icon {
      padding-left: 2.5rem;
    }
    .form-input.with-right-btn {
      padding-right: 2.75rem;
    }
    .toggle-password-btn {
      position: absolute;
      right: 0.5rem;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      transition: color 0.15s ease;
    }
    .toggle-password-btn:hover {
      color: var(--color-dark-neutral);
    }
    .auth-footer { margin-top: 1.75rem; font-size: 0.875rem; color: var(--color-text-secondary); }
    .auth-switch-link { color: var(--color-primary); font-weight: 600; text-decoration: none; margin-left: 0.25rem; }
    .auth-switch-link:hover { text-decoration: underline; }
    .auth-back { margin-top: 1rem; }
    .back-link { font-size: 0.8125rem; color: var(--color-text-secondary); text-decoration: none; }
    .back-link:hover { color: var(--color-primary); }
    @media (max-width: 480px) {
      .auth-card {
        padding: 1.75rem 1.25rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const url = this.route.snapshot.queryParams['returnUrl'];
    if (url) this.returnUrl = url;
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to sign in. Please check your credentials.';
      }
    });
  }
}
