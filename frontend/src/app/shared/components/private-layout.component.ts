import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-layout">
      <!-- Mobile Top Bar (visible on <= 768px) -->
      <header class="mobile-topbar flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button (click)="toggleSidebar()" class="mobile-toggle-btn" aria-label="Toggle navigation menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="mobile-brand flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span class="mobile-brand-title">DocVault</span>
          </div>
        </div>

        <div class="mobile-user-avatar" *ngIf="user" [title]="user.name">
          {{ userInitials }}
        </div>
      </header>

      <!-- Mobile Backdrop Overlay -->
      <div *ngIf="sidebarOpen" class="sidebar-backdrop" (click)="closeSidebar()"></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header flex items-center justify-between">
          <div class="brand-wrapper flex items-center gap-2">
            <div class="brand-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-title">DocVault</span>
              <span class="brand-tier">ENTERPRISE</span>
            </div>
          </div>
          <button (click)="closeSidebar()" class="mobile-close-btn" aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" (click)="closeSidebar()" class="nav-item">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            <span>Dashboard</span>
          </a>

          <a routerLink="/documents" routerLinkActive="active" (click)="closeSidebar()" class="nav-item">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Documents</span>
          </a>

          <a routerLink="/categories" routerLinkActive="active" (click)="closeSidebar()" class="nav-item">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>Categories</span>
          </a>
        </nav>

        <!-- Storage Quota Widget -->
        <div class="quota-widget" *ngIf="user">
          <div class="flex items-center justify-between quota-header">
            <span class="quota-label">Storage Quota</span>
            <span class="quota-counter font-bold">{{ user.activeFileCount }} / 20</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              [style.width.%]="(user.activeFileCount / 20) * 100"
              [class.warning]="user.activeFileCount >= 16 && user.activeFileCount < 20"
              [class.danger]="user.activeFileCount >= 20"
            ></div>
          </div>
          <div class="quota-status flex items-center justify-between">
            <span class="quota-pct">{{ ((user.activeFileCount / 20) * 100).toFixed(0) }}% capacity</span>
            <span class="quota-remain">{{ 20 - user.activeFileCount }} slots free</span>
          </div>
          <div class="quota-alert" *ngIf="user.activeFileCount >= 20">
            ⚠️ Limit reached! Delete files to upload new ones.
          </div>
        </div>

        <!-- Sidebar Footer & User Profile -->
        <div class="sidebar-footer">
          <div class="user-profile flex items-center justify-between" *ngIf="user">
            <div class="user-badge flex items-center gap-2">
              <div class="user-avatar">{{ userInitials }}</div>
              <div class="user-details">
                <span class="user-name" [title]="user.name">{{ user.name }}</span>
                <span class="user-email" [title]="user.email">{{ user.email }}</span>
              </div>
            </div>
            <button (click)="onLogout()" class="logout-btn" title="Sign Out of DocVault">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Container -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--color-light-bg);
      position: relative;
    }

    /* Mobile Top Bar */
    .mobile-topbar {
      display: none;
      height: 60px;
      padding: 0 1.25rem;
      background-color: var(--color-dark-neutral);
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 40;
    }
    .mobile-toggle-btn {
      background: none;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      padding: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
    }
    .mobile-toggle-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .mobile-brand-title {
      font-weight: 800;
      font-size: 1.125rem;
      letter-spacing: -0.025em;
    }
    .mobile-user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-primary);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Backdrop */
    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(3px);
      z-index: 45;
      animation: fadeIn 0.2s ease;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background-color: var(--color-dark-neutral);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      flex-shrink: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 50;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sidebar-header {
      margin-bottom: 2rem;
      padding: 0 0.5rem;
    }
    .brand-icon-box {
      width: 36px;
      height: 36px;
      background: var(--color-primary);
      color: #ffffff;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.2;
    }
    .brand-tier {
      font-size: 0.625rem;
      letter-spacing: 0.1em;
      color: #94a3b8;
      font-weight: 700;
    }
    .mobile-close-btn {
      display: none;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--radius-sm);
    }
    .mobile-close-btn:hover {
      color: #ffffff;
    }

    /* Navigation */
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      border-radius: var(--radius-sm);
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.15s ease;
    }
    .nav-icon {
      color: #64748b;
      transition: color 0.15s ease;
    }
    .nav-item:hover {
      background-color: var(--color-dark-surface);
      color: #ffffff;
    }
    .nav-item:hover .nav-icon {
      color: #ffffff;
    }
    .nav-item.active {
      background-color: var(--color-primary);
      color: #ffffff;
      font-weight: 600;
    }
    .nav-item.active .nav-icon {
      color: #ffffff;
    }

    /* Quota Widget */
    .quota-widget {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md);
      padding: 0.875rem;
      margin-bottom: 1.25rem;
    }
    .quota-header {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }
    .quota-label {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.6875rem;
    }
    .quota-counter {
      color: #ffffff;
      font-size: 0.75rem;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: #334155;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    .progress-fill.warning {
      background: var(--color-accent);
    }
    .progress-fill.danger {
      background: var(--color-danger);
    }
    .quota-status {
      font-size: 0.6875rem;
      color: #64748b;
    }
    .quota-alert {
      font-size: 0.6875rem;
      color: #f87171;
      margin-top: 0.5rem;
      font-weight: 600;
      line-height: 1.3;
      padding-top: 0.375rem;
      border-top: 1px dashed rgba(248, 113, 113, 0.2);
    }

    /* Sidebar Footer */
    .sidebar-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1rem;
    }
    .user-profile {
      gap: 0.5rem;
    }
    .user-badge {
      overflow: hidden;
    }
    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      color: #ffffff;
      font-size: 0.8125rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .user-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .user-name {
      font-size: 0.8125rem;
      color: #ffffff;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-email {
      font-size: 0.6875rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .logout-btn {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.375rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ef4444;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: 2rem;
      background-color: var(--color-light-bg);
      overflow-y: auto;
      min-width: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .mobile-topbar {
        display: flex;
      }
      .sidebar-backdrop {
        display: block;
      }
      .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .mobile-close-btn {
        display: block;
      }
      .main-content {
        padding: 5rem 1rem 2rem;
      }
    }
  `]
})
export class PrivateLayoutComponent {
  sidebarOpen = false;

  get user() {
    return this.authService.currentUser();
  }

  get userInitials(): string {
    const name = this.user?.name || '';
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
