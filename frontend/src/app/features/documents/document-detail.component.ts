import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';
import { AuthService } from '../../core/services/auth.service';
import { DocumentItem } from '../../core/models/document.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="document-detail-page">
      <div class="navigation-bar">
        <a routerLink="/documents" class="btn btn-outline btn-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Documents</span>
        </a>
      </div>

      <!-- Skeleton Loading State -->
      <div *ngIf="isLoading" class="skeleton-container">
        <div class="card header-card" style="margin-bottom: 1.5rem;">
          <div class="skeleton" style="width: 200px; height: 32px; margin-bottom: 0.75rem;"></div>
          <div class="skeleton" style="width: 120px; height: 20px;"></div>
        </div>
        <div class="card metadata-card">
          <div class="skeleton" style="width: 220px; height: 24px; margin-bottom: 1.5rem;"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="skeleton" style="height: 48px;" *ngFor="let i of [1,2,3,4,5,6]"></div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && document" class="detail-container">
        <!-- Header Card -->
        <div class="card header-card flex items-center justify-between">
          <div class="file-heading flex items-center gap-4">
            <div class="file-icon-badge" [ngClass]="getFormatBadgeClass(document.extension)">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div>
              <h2>{{ document.originalName }}</h2>
              <div class="badges-row flex items-center gap-2" style="margin-top: 0.375rem;">
                <span class="format-badge" [ngClass]="getFormatBadgeClass(document.extension)">
                  {{ document.extension.toUpperCase() }}
                </span>
                <span class="badge" [class.badge-blue]="document.categoryName" [class.badge-gray]="!document.categoryName">
                  {{ document.categoryName || 'Uncategorized' }}
                </span>
              </div>
            </div>
          </div>

          <div class="header-actions flex gap-2">
            <button (click)="onDownload()" class="btn btn-primary flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download File</span>
            </button>
            <button (click)="openDeleteModal()" class="btn btn-danger flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>

        <!-- Technical & Security Metadata Card -->
        <div class="card metadata-card">
          <div class="card-section-title flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-primary);">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h3>Cryptographic & Technical Metadata</h3>
          </div>

          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">Original Filename</span>
              <span class="meta-value">{{ document.originalName }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">File Size</span>
              <span class="meta-value">{{ (document.size / 1024).toFixed(2) }} KB ({{ document.size | number }} bytes)</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Content / MIME Type</span>
              <span class="meta-value"><code>{{ document.mimeType }}</code></span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Upload Timestamp</span>
              <span class="meta-value">{{ document.uploadDate | date:'fullDate' }} at {{ document.uploadDate | date:'mediumTime' }}</span>
            </div>

            <div class="meta-item full-width">
              <span class="meta-label">SHA-256 Checksum Fingerprint</span>
              <div class="checksum-box flex items-center justify-between">
                <code class="checksum-code">{{ document.checksum }}</code>
                <button (click)="copyChecksum()" class="btn btn-outline btn-xs flex items-center gap-1" title="Copy SHA-256 hash to clipboard">
                  <svg *ngIf="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <svg *ngIf="copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{{ copied ? 'Copied to Clipboard!' : 'Copy Hash' }}</span>
                </button>
              </div>
            </div>

            <div class="meta-item full-width" *ngIf="document.description">
              <span class="meta-label">Description / Work Notes</span>
              <p class="description-text">{{ document.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal && document" class="modal-overlay">
      <div class="modal-content" style="max-width: 440px;">
        <div class="modal-header flex items-center justify-between">
          <div class="flex items-center gap-2 text-danger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 style="color: #b91c1c;">Confirm Document Deletion</h3>
          </div>
          <button (click)="closeDeleteModal()" class="close-btn">&times;</button>
        </div>

        <div style="margin-top: 1.25rem;">
          <p style="color: var(--color-dark-neutral); font-size: 0.95rem; line-height: 1.5;">
            Are you sure you want to delete
            <strong>{{ document.originalName }}</strong>?
          </p>
          <p style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-top: 0.5rem; line-height: 1.5;">
            This will permanently remove the file streams from MongoDB GridFS and free up storage quota.
          </p>
        </div>

        <div class="flex justify-end gap-2" style="margin-top: 1.75rem;">
          <button type="button" (click)="closeDeleteModal()" class="btn btn-outline" [disabled]="isDeleting">Cancel</button>
          <button type="button" (click)="executeDelete()" class="btn btn-danger" [disabled]="isDeleting">
            <span *ngIf="!isDeleting">Permanently Delete</span>
            <span *ngIf="isDeleting" class="flex items-center gap-2">
              <span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span>
              <span>Deleting...</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .document-detail-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .navigation-bar { margin-bottom: 0.5rem; }
    .header-card { padding: 1.75rem; margin-bottom: 1.5rem; }
    .file-icon-badge {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .file-heading h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-dark-neutral); letter-spacing: -0.025em; }
    .metadata-card { padding: 1.75rem; }
    .card-section-title { margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; }
    .card-section-title h3 { font-size: 1.125rem; font-weight: 700; color: var(--color-dark-neutral); }
    .metadata-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .meta-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .full-width { grid-column: span 2; }
    .meta-label { font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .meta-value { font-size: 0.95rem; font-weight: 500; color: var(--color-dark-neutral); }
    .checksum-box {
      background: #f8fafc;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      margin-top: 0.25rem;
    }
    .checksum-code { font-family: monospace; font-size: 0.8125rem; color: #1e293b; word-break: break-all; }
    .description-text { font-size: 0.95rem; color: var(--color-text-primary); background: #f8fafc; padding: 0.875rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-top: 0.25rem; line-height: 1.5; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-secondary); }
    .btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
    .format-badge {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .format-pdf { background: #fee2e2; color: #b91c1c; }
    .format-word { background: #dbeafe; color: #1d4ed8; }
    .format-excel { background: #d1fae5; color: #047857; }
    .format-image { background: #f3e8ff; color: #7e22ce; }
    .format-default { background: #f1f5f9; color: #475569; }
    @media (max-width: 768px) {
      .metadata-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .header-card { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
      .checksum-box { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    }
  `]
})
export class DocumentDetailComponent implements OnInit {
  document: DocumentItem | null = null;
  isLoading = true;
  copied = false;
  showDeleteModal = false;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
    }
  }

  loadDocument(id: string): void {
    this.isLoading = true;
    this.documentService.getDocumentById(id).subscribe({
      next: (doc) => {
        this.document = doc;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load document detail', err);
        this.isLoading = false;
        this.router.navigate(['/documents']);
      }
    });
  }

  copyChecksum(): void {
    if (this.document) {
      navigator.clipboard.writeText(this.document.checksum);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2500);
    }
  }

  onDownload(): void {
    if (this.document) {
      this.documentService.downloadDocument(this.document.id, this.document.originalName);
    }
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.isDeleting = false;
  }

  executeDelete(): void {
    if (!this.document) return;

    this.isDeleting = true;
    this.documentService.deleteDocument(this.document.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.authService.checkSession().subscribe();
        this.router.navigate(['/documents']);
      },
      error: (err) => {
        this.isDeleting = false;
        alert(err.error?.message || 'Failed to delete document.');
      }
    });
  }

  getFormatBadgeClass(ext: string): string {
    const lower = (ext || '').toLowerCase();
    if (lower === 'pdf') return 'format-pdf';
    if (['doc', 'docx'].includes(lower)) return 'format-word';
    if (['xls', 'xlsx'].includes(lower)) return 'format-excel';
    if (['png', 'jpg', 'jpeg'].includes(lower)) return 'format-image';
    return 'format-default';
  }
}
