import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { DocumentItem, PaginationMeta } from '../../core/models/document.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="documents-page">
      <div class="page-header flex items-center justify-between">
        <div>
          <h2>Document Repository</h2>
          <p class="subtitle">Search, filter, upload, and inspect verified streaming enterprise files.</p>
        </div>
        <button
          (click)="openUploadModal()"
          class="btn btn-primary flex items-center gap-2"
          [disabled]="authService.currentUser()?.activeFileCount! >= 20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Upload Document</span>
        </button>
      </div>

      <!-- Storage Warning Banner -->
      <div *ngIf="authService.currentUser()?.activeFileCount! >= 20" class="alert alert-danger flex items-center gap-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <strong>Storage Quota Exhausted (20 / 20 documents).</strong>
          <span> Per system policy, you must delete an existing document before uploading a new file.</span>
        </div>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="card filters-card flex items-center justify-between gap-4">
        <div class="search-box flex-1">
          <div class="input-with-search">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="form-input search-input"
              placeholder="Search documents by filename or notes..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
            />
            <button
              *ngIf="searchQuery"
              type="button"
              class="clear-search-btn"
              (click)="clearSearch()"
              title="Clear search"
            >
              &times;
            </button>
          </div>
        </div>

        <div class="filter-controls flex items-center gap-3">
          <div class="select-wrapper">
            <select class="form-select" [(ngModel)]="selectedCategory" (change)="loadDocuments()">
              <option value="">All Categories</option>
              <option value="uncategorized">Uncategorized</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="select-wrapper">
            <select class="form-select" [(ngModel)]="sortOrder" (change)="loadDocuments()">
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Documents Data Table Card -->
      <div class="card table-card">
        <!-- Skeleton Loading State -->
        <div *ngIf="isLoading" class="skeleton-table">
          <div class="skeleton-row header-row">
            <div class="skeleton" style="width: 25%; height: 16px;"></div>
            <div class="skeleton" style="width: 15%; height: 16px;"></div>
            <div class="skeleton" style="width: 10%; height: 16px;"></div>
            <div class="skeleton" style="width: 10%; height: 16px;"></div>
            <div class="skeleton" style="width: 15%; height: 16px;"></div>
            <div class="skeleton" style="width: 15%; height: 16px;"></div>
          </div>
          <div class="skeleton-row" *ngFor="let item of [1,2,3,4,5]">
            <div class="skeleton" style="width: 30%; height: 20px;"></div>
            <div class="skeleton" style="width: 15%; height: 16px;"></div>
            <div class="skeleton" style="width: 8%; height: 16px;"></div>
            <div class="skeleton" style="width: 10%; height: 16px;"></div>
            <div class="skeleton" style="width: 12%; height: 16px;"></div>
            <div class="skeleton" style="width: 15%; height: 26px;"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && documents.length === 0" class="empty-state text-center">
          <div class="empty-icon-wrap">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 class="empty-title">No documents found</h3>
          <p class="empty-subtitle">
            {{ searchQuery || selectedCategory ? 'Try adjusting your search query or category filter.' : 'Upload your first verified file to get started.' }}
          </p>
          <button
            *ngIf="!searchQuery && !selectedCategory"
            (click)="openUploadModal()"
            class="btn btn-primary btn-sm"
            style="margin-top: 1rem;"
            [disabled]="authService.currentUser()?.activeFileCount! >= 20"
          >
            Upload Document
          </button>
        </div>

        <!-- Populated Table -->
        <div *ngIf="!isLoading && documents.length > 0" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Format</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of documents">
                <td>
                  <a [routerLink]="['/documents', doc.id]" class="doc-link flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" style="flex-shrink: 0;">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <strong>{{ doc.originalName }}</strong>
                  </a>
                  <div *ngIf="doc.description" class="doc-desc">{{ doc.description }}</div>
                </td>
                <td>
                  <span class="badge" [class.badge-blue]="doc.categoryName" [class.badge-gray]="!doc.categoryName">
                    {{ doc.categoryName || 'Uncategorized' }}
                  </span>
                </td>
                <td>
                  <span class="format-badge" [ngClass]="getFormatBadgeClass(doc.extension)">
                    {{ doc.extension.toUpperCase() }}
                  </span>
                </td>
                <td>{{ (doc.size / 1024).toFixed(1) }} KB</td>
                <td>{{ doc.uploadDate | date:'mediumDate' }}</td>
                <td class="text-right">
                  <div class="action-buttons flex gap-2 justify-end">
                    <a [routerLink]="['/documents', doc.id]" class="btn btn-outline btn-xs" title="View Technical Details">
                      Details
                    </a>
                    <button (click)="onDownload(doc)" class="btn btn-primary btn-xs flex items-center gap-1" title="Download File">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Download</span>
                    </button>
                    <button (click)="confirmDelete(doc)" class="btn btn-danger btn-xs" title="Delete Document">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div *ngIf="pagination && pagination.totalPages > 1" class="pagination-bar flex items-center justify-between">
          <span class="page-info">
            Showing Page <strong>{{ pagination.currentPage }}</strong> of <strong>{{ pagination.totalPages }}</strong> ({{ pagination.totalItems }} total files)
          </span>
          <div class="page-buttons flex gap-2">
            <button
              class="btn btn-outline btn-xs flex items-center gap-1"
              [disabled]="!pagination.hasPrevPage"
              (click)="goToPage(pagination.currentPage - 1)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Previous</span>
            </button>
            <button
              class="btn btn-outline btn-xs flex items-center gap-1"
              [disabled]="!pagination.hasNextPage"
              (click)="goToPage(pagination.currentPage + 1)"
            >
              <span>Next</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drag-and-Drop Upload Modal -->
    <div *ngIf="showUploadModal" class="modal-overlay">
      <div class="modal-content upload-modal-dialog">
        <div class="modal-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="modal-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h3>Upload New Document</h3>
          </div>
          <button (click)="closeUploadModal()" class="close-btn" aria-label="Close dialog">&times;</button>
        </div>

        <div *ngIf="uploadError" class="alert alert-danger flex items-center gap-2" style="margin-top: 1rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ uploadError }}</span>
        </div>

        <form (ngSubmit)="submitUpload()" style="margin-top: 1.25rem;">
          <!-- Drag and Drop Dropzone -->
          <div
            class="dropzone-area"
            [class.dragging]="isDragging"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            *ngIf="!selectedFile"
          >
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              class="hidden-file-input"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            <div class="dropzone-content text-center" (click)="fileInput.click()">
              <div class="drop-icon-box">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m16 16-4-4-4 4"></path>
                </svg>
              </div>
              <p class="dropzone-title"><strong>Click to browse</strong> or drag & drop file here</p>
              <p class="dropzone-hints">PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (Max 1 MB)</p>
            </div>
          </div>

          <!-- Selected File Card -->
          <div class="selected-file-card flex items-center justify-between" *ngIf="selectedFile">
            <div class="flex items-center gap-3">
              <div class="file-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div>
                <strong class="selected-file-name">{{ selectedFile.name }}</strong>
                <span class="selected-file-size">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
              </div>
            </div>
            <button type="button" (click)="removeSelectedFile()" class="remove-file-btn" title="Choose different file">
              &times;
            </button>
          </div>

          <div class="form-group" style="margin-top: 1.25rem;">
            <label class="form-label">Classification Category</label>
            <select class="form-select" [(ngModel)]="uploadCategoryId" name="categoryId">
              <option value="">Uncategorized</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Description / Notes (Optional)</label>
            <textarea
              class="form-textarea"
              rows="3"
              [(ngModel)]="uploadDescription"
              name="description"
              placeholder="Provide context, revision notes, or reference information..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-2" style="margin-top: 1.5rem;">
            <button type="button" (click)="closeUploadModal()" class="btn btn-outline" [disabled]="isUploading">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="!selectedFile || isUploading">
              <span *ngIf="!isUploading" class="flex items-center gap-2">
                <span>Upload & Stream File</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </span>
              <span *ngIf="isUploading" class="flex items-center gap-2">
                <span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span>
                <span>Streaming & Fingerprinting...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Custom Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal && documentToDelete" class="modal-overlay">
      <div class="modal-content delete-modal-dialog">
        <div class="modal-header flex items-center justify-between">
          <div class="flex items-center gap-2 text-danger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 style="color: #b91c1c;">Confirm Document Deletion</h3>
          </div>
          <button (click)="closeDeleteModal()" class="close-btn" aria-label="Close dialog">&times;</button>
        </div>

        <div style="margin-top: 1.25rem;">
          <p style="color: var(--color-dark-neutral); font-size: 0.95rem; line-height: 1.5;">
            Are you sure you want to permanently delete
            <strong>{{ documentToDelete.originalName }}</strong>?
          </p>
          <p style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-top: 0.5rem; line-height: 1.5;">
            This action will purge the underlying GridFS chunks, calculate updated quota statistics, and cannot be undone.
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
    .documents-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header h2 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.025em; }
    .subtitle { color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem; }
    .filters-card { padding: 1rem 1.5rem; }
    .flex-1 { flex: 1; }
    .input-with-search { position: relative; display: flex; align-items: center; }
    .search-icon { position: absolute; left: 0.875rem; color: #94a3b8; pointer-events: none; }
    .search-input { padding-left: 2.5rem; padding-right: 2rem; }
    .clear-search-btn { position: absolute; right: 0.75rem; background: none; border: none; font-size: 1.25rem; color: #94a3b8; cursor: pointer; }
    .clear-search-btn:hover { color: var(--color-dark-neutral); }
    .doc-link { color: var(--color-dark-neutral); text-decoration: none; }
    .doc-link:hover { color: var(--color-primary); }
    .doc-desc { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 0.25rem; padding-left: 1.625rem; }
    .table-card { padding: 0; }
    .table-container { border: none; border-radius: 0; }
    .text-right { text-align: right; }
    .justify-end { justify-content: flex-end; }
    .btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
    .pagination-bar { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); }
    .page-info { font-size: 0.875rem; color: var(--color-text-secondary); }
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

    /* Skeleton table */
    .skeleton-table { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .skeleton-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .header-row { padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); }

    /* Empty state */
    .empty-state { padding: 3rem 1.5rem; }
    .empty-icon-wrap { width: 64px; height: 64px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .empty-title { font-size: 1.125rem; font-weight: 700; color: var(--color-dark-neutral); margin-bottom: 0.25rem; }
    .empty-subtitle { font-size: 0.875rem; color: var(--color-text-secondary); max-width: 360px; margin: 0 auto; }

    /* Upload Dropzone */
    .upload-modal-dialog { max-width: 520px; }
    .delete-modal-dialog { max-width: 440px; }
    .modal-header-icon {
      width: 32px;
      height: 32px;
      background: #eff6ff;
      color: var(--color-primary);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-header h3 { font-size: 1.125rem; font-weight: 700; color: var(--color-dark-neutral); }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-secondary); }
    .close-btn:hover { color: var(--color-dark-neutral); }
    .dropzone-area {
      border: 2px dashed #cbd5e1;
      border-radius: var(--radius-md);
      padding: 2rem 1.5rem;
      background: #f8fafc;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .dropzone-area:hover, .dropzone-area.dragging {
      border-color: var(--color-primary);
      background: #eff6ff;
    }
    .hidden-file-input { display: none; }
    .drop-icon-box {
      width: 52px;
      height: 52px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 50%;
      margin: 0 auto 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
    }
    .dropzone-title { font-size: 0.875rem; color: var(--color-dark-neutral); margin-bottom: 0.25rem; }
    .dropzone-hints { font-size: 0.75rem; color: var(--color-text-secondary); }
    .selected-file-card {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: var(--radius-md);
      padding: 0.875rem 1rem;
    }
    .file-card-icon { color: var(--color-primary); }
    .selected-file-name { font-size: 0.875rem; color: var(--color-dark-neutral); display: block; }
    .selected-file-size { font-size: 0.75rem; color: var(--color-text-secondary); }
    .remove-file-btn { background: none; border: none; font-size: 1.25rem; color: #ef4444; cursor: pointer; padding: 0.25rem; }
    @media (max-width: 768px) {
      .filters-card { flex-direction: column; align-items: stretch; }
      .filter-controls { flex-direction: column; }
    }
  `]
})
export class DocumentsComponent implements OnInit {
  documents: DocumentItem[] = [];
  categories: Category[] = [];
  pagination: PaginationMeta | null = null;

  isLoading = true;
  searchQuery = '';
  selectedCategory = '';
  sortOrder = 'desc';
  currentPage = 1;

  showUploadModal = false;
  isDragging = false;
  selectedFile: File | null = null;
  uploadCategoryId = '';
  uploadDescription = '';
  isUploading = false;
  uploadError = '';

  showDeleteModal = false;
  documentToDelete: DocumentItem | null = null;
  isDeleting = false;

  constructor(
    private documentService: DocumentService,
    private categoryService: CategoryService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadDocuments();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.documentService
      .getDocuments({
        page: this.currentPage,
        limit: 10,
        search: this.searchQuery,
        categoryId: this.selectedCategory,
        sortOrder: this.sortOrder
      })
      .subscribe({
        next: (res) => {
          this.documents = res.documents;
          this.pagination = res.pagination;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load documents', err);
          this.isLoading = false;
        }
      });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadDocuments();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadDocuments();
  }

  onDownload(doc: DocumentItem): void {
    this.documentService.downloadDocument(doc.id, doc.originalName);
  }

  confirmDelete(doc: DocumentItem): void {
    this.documentToDelete = doc;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.documentToDelete = null;
    this.isDeleting = false;
  }

  executeDelete(): void {
    if (!this.documentToDelete) return;

    this.isDeleting = true;
    this.documentService.deleteDocument(this.documentToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.authService.checkSession().subscribe();
        this.loadDocuments();
      },
      error: (err) => {
        this.isDeleting = false;
        alert(err.error?.message || 'Failed to delete document.');
      }
    });
  }

  openUploadModal(): void {
    this.uploadError = '';
    this.selectedFile = null;
    this.uploadCategoryId = '';
    this.uploadDescription = '';
    this.isDragging = false;
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  validateAndSetFile(file: File): void {
    if (file.size > 1048576) {
      this.uploadError = `Selected file '${file.name}' (${(file.size / 1024).toFixed(1)} KB) exceeds the strict 1 MB maximum size limit.`;
      this.selectedFile = null;
      return;
    }
    this.uploadError = '';
    this.selectedFile = file;
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.uploadError = '';
  }

  submitUpload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadError = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if (this.uploadCategoryId) {
      formData.append('categoryId', this.uploadCategoryId);
    }
    if (this.uploadDescription) {
      formData.append('description', this.uploadDescription);
    }

    this.documentService.uploadDocument(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.closeUploadModal();
        this.authService.checkSession().subscribe();
        this.loadDocuments();
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadError = err.error?.message || 'Upload failed. Please try again.';
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
