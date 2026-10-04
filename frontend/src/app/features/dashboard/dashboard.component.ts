import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';
import { DashboardStats } from '../../core/models/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="page-header flex items-center justify-between">
        <div>
          <h2>System Dashboard</h2>
          <p class="subtitle">Real-time overview of document storage, quota, and category analytics.</p>
        </div>
        <a routerLink="/documents" class="btn btn-primary flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Upload Document</span>
        </a>
      </div>

      <!-- SKELETON LOADING STATE -->
      <div *ngIf="isLoading" class="skeleton-container">
        <div class="metrics-row">
          <div class="card metric-card skeleton-metric" *ngFor="let i of [1,2,3,4]">
            <div class="skeleton" style="width: 48px; height: 48px; border-radius: 8px;"></div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
              <div class="skeleton" style="width: 60%; height: 12px;"></div>
              <div class="skeleton" style="width: 40%; height: 24px;"></div>
              <div class="skeleton" style="width: 80%; height: 10px;"></div>
            </div>
          </div>
        </div>

        <div class="content-grid" style="margin-top: 1.5rem;">
          <div class="card recent-card">
            <div class="skeleton" style="width: 160px; height: 20px; margin-bottom: 1.5rem;"></div>
            <div class="skeleton" style="width: 100%; height: 40px; margin-bottom: 0.75rem;" *ngFor="let i of [1,2,3,4]"></div>
          </div>
          <div class="card categories-card">
            <div class="skeleton" style="width: 140px; height: 20px; margin-bottom: 1.5rem;"></div>
            <div class="skeleton" style="width: 100%; height: 44px; margin-bottom: 0.75rem;" *ngFor="let i of [1,2,3]"></div>
          </div>
        </div>
      </div>

      <!-- LOADED DATA VIEW -->
      <div *ngIf="!isLoading && stats" class="dashboard-grid">
        <!-- Metric Cards -->
        <div class="metrics-row">
          <div class="card metric-card">
            <div class="metric-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Active Documents</span>
              <strong class="metric-value">{{ stats.totalDocuments || stats.activeFilesCount }} <span class="metric-denom">/ {{ stats.maxAllowedFiles }}</span></strong>
              <span class="metric-subtext">{{ stats.remainingFilesCount }} uploads available</span>
            </div>
          </div>

          <div class="card metric-card">
            <div class="metric-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Uploaded This Month</span>
              <strong class="metric-value">{{ stats.documentsThisMonth || 0 }}</strong>
              <span class="metric-subtext">Current calendar cycle</span>
            </div>
          </div>

          <div class="card metric-card">
            <div class="metric-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Storage Utilized</span>
              <strong class="metric-value">{{ stats.totalSizeMB }} MB</strong>
              <span class="metric-subtext">{{ stats.totalSizeBytes | number }} total bytes</span>
            </div>
          </div>

          <div class="card metric-card">
            <div class="metric-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Active Workspaces</span>
              <strong class="metric-value">{{ stats.categoryCount || stats.categoryBreakdown.length }}</strong>
              <span class="metric-subtext">Classified categories</span>
            </div>
          </div>
        </div>

        <!-- Middle Content Grid -->
        <div class="content-grid">
          <!-- Recent Uploads Table Card -->
          <div class="card recent-card">
            <div class="card-header flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <h3>Recent Documents</h3>
              </div>
              <a routerLink="/documents" class="btn btn-outline btn-sm">View All Documents</a>
            </div>

            <div *ngIf="stats.recentUploads.length === 0" class="empty-state text-center">
              <div class="empty-icon-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <p class="empty-title">No documents uploaded yet</p>
              <p class="empty-subtitle">Upload your first file to begin managing your enterprise assets.</p>
              <a routerLink="/documents" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Upload Document</a>
            </div>

            <div *ngIf="stats.recentUploads.length > 0" class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th class="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let doc of stats.recentUploads">
                    <td>
                      <a [routerLink]="['/documents', doc.id]" class="doc-link flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <strong>{{ doc.originalName }}</strong>
                      </a>
                    </td>
                    <td>
                      <span class="badge" [class.badge-blue]="doc.categoryName" [class.badge-gray]="!doc.categoryName">
                        {{ doc.categoryName || 'Uncategorized' }}
                      </span>
                    </td>
                    <td>{{ (doc.size / 1024).toFixed(1) }} KB</td>
                    <td>{{ doc.uploadDate | date:'mediumDate' }}</td>
                    <td class="text-right">
                      <button (click)="onDownload(doc)" class="btn btn-outline btn-xs flex items-center gap-1" title="Download Document">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Category Breakdown Card -->
          <div class="card categories-card">
            <div class="card-header flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent);">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <h3>Category Distribution</h3>
              </div>
              <a routerLink="/categories" class="btn btn-outline btn-xs">Manage</a>
            </div>

            <div *ngIf="stats.categoryBreakdown.length === 0" class="empty-state text-center">
              <p class="empty-title">No categories defined</p>
              <p class="empty-subtitle">Create categories to structure your files into logical groups.</p>
              <a routerLink="/categories" class="btn btn-outline btn-sm" style="margin-top: 0.75rem;">Create Category</a>
            </div>

            <div class="cat-list" *ngIf="stats.categoryBreakdown.length > 0">
              <div *ngFor="let cat of stats.categoryBreakdown" class="cat-item flex items-center justify-between">
                <span class="cat-name">{{ cat.categoryName }}</span>
                <span class="badge badge-blue">{{ cat.count }} files</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { display: flex; flex-direction: column; gap: 2rem; }
    .page-header h2 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.025em; }
    .subtitle { color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem; }
    .metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .metric-card { display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem; }
    .metric-icon { width: 52px; height: 52px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .metric-icon.blue { background: #dbeafe; color: #1d4ed8; }
    .metric-icon.purple { background: #f3e8ff; color: #7e22ce; }
    .metric-icon.orange { background: #ffedd5; color: #c2410c; }
    .metric-icon.green { background: #d1fae5; color: #047857; }
    .metric-content { display: flex; flex-direction: column; }
    .metric-label { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 1.625rem; font-weight: 800; color: var(--color-dark-neutral); line-height: 1.2; margin: 0.25rem 0 0.125rem; }
    .metric-denom { font-size: 1rem; color: #94a3b8; font-weight: 500; }
    .metric-subtext { font-size: 0.75rem; color: var(--color-text-secondary); }
    .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-top: 1.5rem; }
    .recent-card, .categories-card { padding: 1.5rem; }
    .card-header { margin-bottom: 1.25rem; }
    .card-header h3 { font-size: 1.125rem; font-weight: 700; color: var(--color-dark-neutral); }
    .doc-link { color: var(--color-dark-neutral); text-decoration: none; }
    .doc-link:hover { color: var(--color-primary); }
    .text-right { text-align: right; }
    .empty-state { padding: 2.5rem 1rem; }
    .empty-icon-wrap { width: 56px; height: 56px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .empty-title { font-weight: 700; color: var(--color-dark-neutral); margin-bottom: 0.25rem; font-size: 0.95rem; }
    .empty-subtitle { font-size: 0.8125rem; color: var(--color-text-secondary); max-width: 320px; margin: 0 auto; }
    .cat-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .cat-item { padding: 0.75rem 1rem; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.875rem; }
    .cat-name { font-weight: 600; color: var(--color-dark-neutral); }
    @media (max-width: 960px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.documentService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
        this.isLoading = false;
      }
    });
  }

  onDownload(doc: any): void {
    this.documentService.downloadDocument(doc.id, doc.originalName);
  }
}
