import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-page">
      <div class="page-header flex items-center justify-between">
        <div>
          <h2>Category Management</h2>
          <p class="subtitle">Organize and structure your workspace documents with custom category tags.</p>
        </div>
        <button (click)="openCreateModal()" class="btn btn-primary flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Category</span>
        </button>
      </div>

      <div class="card table-card">
        <!-- Skeleton Loading State -->
        <div *ngIf="isLoading" class="skeleton-table">
          <div class="skeleton-row header-row">
            <div class="skeleton" style="width: 25%; height: 16px;"></div>
            <div class="skeleton" style="width: 35%; height: 16px;"></div>
            <div class="skeleton" style="width: 15%; height: 16px;"></div>
            <div class="skeleton" style="width: 15%; height: 16px;"></div>
          </div>
          <div class="skeleton-row" *ngFor="let item of [1,2,3,4]">
            <div class="skeleton" style="width: 20%; height: 20px;"></div>
            <div class="skeleton" style="width: 40%; height: 16px;"></div>
            <div class="skeleton" style="width: 12%; height: 16px;"></div>
            <div class="skeleton" style="width: 18%; height: 26px;"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && categories.length === 0" class="empty-state text-center">
          <div class="empty-icon-wrap">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </div>
          <h3 class="empty-title">No categories created yet</h3>
          <p class="empty-subtitle">Create your first category to classify documents by project, department, or status.</p>
          <button (click)="openCreateModal()" class="btn btn-primary btn-sm" style="margin-top: 1rem;">
            Create First Category
          </button>
        </div>

        <!-- Data Table -->
        <div *ngIf="!isLoading && categories.length > 0" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Assigned Documents</th>
                <th>Created Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cat of categories">
                <td>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    <strong>{{ cat.name }}</strong>
                  </div>
                </td>
                <td style="color: var(--color-text-secondary); font-size: 0.875rem;">
                  {{ cat.description || 'No description provided' }}
                </td>
                <td><span class="badge badge-blue">{{ cat.fileCount || 0 }} files</span></td>
                <td>{{ cat.createdAt | date:'mediumDate' }}</td>
                <td class="text-right">
                  <div class="action-buttons flex gap-2 justify-end">
                    <button (click)="openEditModal(cat)" class="btn btn-outline btn-xs flex items-center gap-1" title="Edit Category">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button (click)="confirmDelete(cat)" class="btn btn-danger btn-xs" title="Delete Category">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div *ngIf="showModal" class="modal-overlay">
      <div class="modal-content" style="max-width: 480px;">
        <div class="modal-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="modal-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <h3>{{ editMode ? 'Edit Category' : 'Create New Category' }}</h3>
          </div>
          <button (click)="closeModal()" class="close-btn" aria-label="Close dialog">&times;</button>
        </div>

        <div *ngIf="modalError" class="alert alert-danger flex items-center gap-2" style="margin-top: 1rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ modalError }}</span>
        </div>

        <form (ngSubmit)="submitCategory()" style="margin-top: 1.25rem;">
          <div class="form-group">
            <label class="form-label">Category Name</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="categoryForm.name"
              name="name"
              required
              placeholder="e.g. Legal Contracts, Invoices, Compliance..."
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description (Optional)</label>
            <textarea
              class="form-textarea"
              rows="3"
              [(ngModel)]="categoryForm.description"
              name="description"
              placeholder="Scope or policy details for documents tagged with this category..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-2" style="margin-top: 1.5rem;">
            <button type="button" (click)="closeModal()" class="btn btn-outline" [disabled]="isSubmitting">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="!categoryForm.name || isSubmitting">
              <span *ngIf="!isSubmitting">{{ editMode ? 'Update Category' : 'Create Category' }}</span>
              <span *ngIf="isSubmitting" class="flex items-center gap-2">
                <span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span>
                <span>Saving...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal && categoryToDelete" class="modal-overlay">
      <div class="modal-content" style="max-width: 440px;">
        <div class="modal-header flex items-center justify-between">
          <div class="flex items-center gap-2 text-danger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 style="color: #b91c1c;">Confirm Category Deletion</h3>
          </div>
          <button (click)="closeDeleteModal()" class="close-btn" aria-label="Close dialog">&times;</button>
        </div>

        <div style="margin-top: 1.25rem;">
          <p style="color: var(--color-dark-neutral); font-size: 0.95rem; line-height: 1.5;">
            Are you sure you want to delete category
            <strong>{{ categoryToDelete.name }}</strong>?
          </p>
          <p style="font-size: 0.8125rem; color: var(--color-text-secondary); margin-top: 0.5rem; line-height: 1.5;">
            Documents currently tagged with this category will not be deleted; they will become <em>Uncategorized</em>.
          </p>
        </div>

        <div class="flex justify-end gap-2" style="margin-top: 1.75rem;">
          <button type="button" (click)="closeDeleteModal()" class="btn btn-outline" [disabled]="isDeleting">Cancel</button>
          <button type="button" (click)="executeDelete()" class="btn btn-danger" [disabled]="isDeleting">
            <span *ngIf="!isDeleting">Delete Category</span>
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
    .categories-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header h2 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.025em; }
    .subtitle { color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem; }
    .table-card { padding: 0; }
    .table-container { border: none; border-radius: 0; }
    .text-right { text-align: right; }
    .justify-end { justify-content: flex-end; }
    .btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
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
    .skeleton-table { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .skeleton-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .header-row { padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); }
    .empty-state { padding: 3rem 1.5rem; }
    .empty-icon-wrap { width: 64px; height: 64px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .empty-title { font-size: 1.125rem; font-weight: 700; color: var(--color-dark-neutral); margin-bottom: 0.25rem; }
    .empty-subtitle { font-size: 0.875rem; color: var(--color-text-secondary); max-width: 360px; margin: 0 auto; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;

  showModal = false;
  editMode = false;
  editingId: string | null = null;
  categoryForm = {
    name: '',
    description: ''
  };
  isSubmitting = false;
  modalError = '';

  showDeleteModal = false;
  categoryToDelete: Category | null = null;
  isDeleting = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editMode = false;
    this.editingId = null;
    this.categoryForm = { name: '', description: '' };
    this.modalError = '';
    this.showModal = true;
  }

  openEditModal(cat: Category): void {
    this.editMode = true;
    this.editingId = cat.id;
    this.categoryForm = {
      name: cat.name,
      description: cat.description || ''
    };
    this.modalError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitCategory(): void {
    if (!this.categoryForm.name) return;

    this.isSubmitting = true;
    this.modalError = '';

    if (this.editMode && this.editingId) {
      this.categoryService.updateCategory(this.editingId, this.categoryForm).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.modalError = err.error?.message || 'Failed to update category.';
        }
      });
    } else {
      this.categoryService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.modalError = err.error?.message || 'Failed to create category.';
        }
      });
    }
  }

  confirmDelete(cat: Category): void {
    this.categoryToDelete = cat;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
    this.isDeleting = false;
  }

  executeDelete(): void {
    if (!this.categoryToDelete) return;

    this.isDeleting = true;
    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadCategories();
      },
      error: (err) => {
        this.isDeleting = false;
        alert(err.error?.message || 'Failed to delete category.');
      }
    });
  }
}
