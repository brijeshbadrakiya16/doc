import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Utility & Public Header Nav -->
    <header class="public-header">
      <div class="container header-container">
        <a routerLink="/" class="brand">
          <div class="brand-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span class="brand-title">DocVault <span class="brand-highlight">Enterprise</span></span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-links desktop-nav">
          <a href="#problem" class="nav-link">Solution</a>
          <a href="#features" class="nav-link">Capabilities</a>
          <a href="#formats" class="nav-link">Formats</a>
          <a href="#workflow" class="nav-link">Workflow</a>
          <div class="nav-divider"></div>
          <ng-container *ngIf="authService.isAuthenticated(); else authNav">
            <a routerLink="/dashboard" class="btn btn-primary">Go to Workspace</a>
          </ng-container>
          <ng-template #authNav>
            <a routerLink="/login" class="btn btn-outline">Sign In</a>
            <a routerLink="/signup" class="btn btn-primary">Get Started Free</a>
          </ng-template>
        </nav>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          class="mobile-menu-btn"
          (click)="mobileMenuOpen = !mobileMenuOpen"
          [attr.aria-expanded]="mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg *ngIf="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg *ngIf="mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown Navigation Drawer -->
      <div class="mobile-drawer" *ngIf="mobileMenuOpen">
        <a href="#problem" class="mobile-nav-link" (click)="mobileMenuOpen = false">Solution</a>
        <a href="#features" class="mobile-nav-link" (click)="mobileMenuOpen = false">Capabilities</a>
        <a href="#formats" class="mobile-nav-link" (click)="mobileMenuOpen = false">Formats</a>
        <a href="#workflow" class="mobile-nav-link" (click)="mobileMenuOpen = false">Workflow</a>
        <div class="mobile-actions">
          <ng-container *ngIf="authService.isAuthenticated(); else mobileAuthNav">
            <a routerLink="/dashboard" class="btn btn-primary w-full" (click)="mobileMenuOpen = false">Go to Workspace</a>
          </ng-container>
          <ng-template #mobileAuthNav>
            <a routerLink="/login" class="btn btn-outline w-full" (click)="mobileMenuOpen = false">Sign In</a>
            <a routerLink="/signup" class="btn btn-primary w-full" (click)="mobileMenuOpen = false">Get Started Free</a>
          </ng-template>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Enterprise-Grade Document Governance</span>
          </div>
          <h1 class="hero-headline">
            Centralized, Zero-RAM <span class="gradient-text">Streaming Storage</span> for Critical Corporate Assets
          </h1>
          <p class="hero-description">
            Eliminate document chaos, prevent accidental duplicate storage with cryptographic SHA-256 fingerprinting, and organize mission-critical documents with atomic quota control and instant search indexing.
          </p>

          <div class="hero-actions">
            <a routerLink="/signup" class="btn btn-primary btn-lg">
              <span>Start Managing Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#features" class="btn btn-outline btn-lg">Explore Architecture</a>
          </div>

          <div class="trust-metrics">
            <div class="trust-item">
              <strong class="metric-num">GridFS</strong>
              <span class="metric-label">Chunked Binary Streams</span>
            </div>
            <div class="trust-item">
              <strong class="metric-num">SHA-256</strong>
              <span class="metric-label">Cryptographic Uniqueness</span>
            </div>
            <div class="trust-item">
              <strong class="metric-num">1 MB Max</strong>
              <span class="metric-label">20 Files Active Quota</span>
            </div>
          </div>
        </div>

        <!-- Hero Visual Mockup -->
        <div class="hero-visual">
          <div class="visual-card">
            <div class="visual-card-top flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="status-indicator active"></span>
                <span class="visual-title">DocVault Secure Node</span>
              </div>
              <span class="badge badge-blue">Quota: 4 / 20 Used</span>
            </div>

            <div class="visual-doc-list">
              <div class="visual-doc-item flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="doc-badge-icon pdf">PDF</div>
                  <div>
                    <strong class="doc-title">Q4_Audited_Financial_Statement.pdf</strong>
                    <div class="doc-meta">842 KB • Category: Financials • SHA-256 Verified</div>
                  </div>
                </div>
                <span class="badge badge-green">Fingerprinted</span>
              </div>

              <div class="visual-doc-item flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="doc-badge-icon docx">DOC</div>
                  <div>
                    <strong class="doc-title">Master_Services_Agreement_2026.docx</strong>
                    <div class="doc-meta">318 KB • Category: Legal Contracts • SHA-256 Verified</div>
                  </div>
                </div>
                <span class="badge badge-green">Fingerprinted</span>
              </div>

              <div class="visual-doc-item flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="doc-badge-icon xlsx">XLS</div>
                  <div>
                    <strong class="doc-title">Fiscal_Payroll_Consolidation.xlsx</strong>
                    <div class="doc-meta">594 KB • Category: HR • SHA-256 Verified</div>
                  </div>
                </div>
                <span class="badge badge-green">Fingerprinted</span>
              </div>

              <div class="visual-doc-item flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="doc-badge-icon img">PNG</div>
                  <div>
                    <strong class="doc-title">Enterprise_Security_Topology.png</strong>
                    <div class="doc-meta">712 KB • Category: Reports • SHA-256 Verified</div>
                  </div>
                </div>
                <span class="badge badge-green">Fingerprinted</span>
              </div>
            </div>

            <div class="visual-card-bottom flex items-center justify-between">
              <span class="audit-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                GridFS Chunked & Streamed
              </span>
              <span class="quota-counter">16 Storage Slots Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Problem & Solution Section -->
    <section id="problem" class="problem-section">
      <div class="container">
        <div class="section-intro text-center">
          <span class="badge badge-orange">The Challenge</span>
          <h2>Why Document Management Fails in Traditional Systems</h2>
          <p>Scattered files across disparate drives, unindexed records, accidental duplicates, and high-memory upload crashes drain team velocity.</p>
        </div>

        <div class="problem-grid">
          <div class="card problem-card">
            <div class="problem-icon error-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>In-Memory Upload Collapses</h3>
            <p>Traditional web upload architectures buffer files entirely into server RAM, leading to memory spikes and crash loops under concurrent load.</p>
          </div>

          <div class="card problem-card">
            <div class="problem-icon error-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Duplicate Storage Clutter</h3>
            <p>Relying on filename comparisons fails because identical files are renamed. Redundant documents consume quota and create version confusion.</p>
          </div>

          <div class="card problem-card">
            <div class="problem-icon error-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Broken Category Isolation</h3>
            <p>Uncontrolled categories cause cross-workspace leakage and orphan records when categories are deleted without proper reclassification.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Supported Formats Section -->
    <section id="formats" class="formats-section">
      <div class="container">
        <div class="section-intro text-center">
          <span class="badge badge-blue">Supported Formats</span>
          <h2>Validated Document Types with Magic Bytes Verification</h2>
          <p>Every file is rigorously verified by file extension and byte signature before storage acceptance.</p>
        </div>

        <div class="formats-grid">
          <div class="format-card">
            <div class="format-chip-header">
              <span class="format-icon pdf">PDF</span>
              <h4>Adobe Acrobat</h4>
            </div>
            <p>Contracts, invoices, corporate guidelines (.pdf)</p>
          </div>

          <div class="format-card">
            <div class="format-chip-header">
              <span class="format-icon docx">DOC</span>
              <h4>Microsoft Word</h4>
            </div>
            <p>Standard and modern documents (.doc, .docx)</p>
          </div>

          <div class="format-card">
            <div class="format-chip-header">
              <span class="format-icon xlsx">XLS</span>
              <h4>Microsoft Excel</h4>
            </div>
            <p>Workbooks, ledgers, analytics (.xls, .xlsx)</p>
          </div>

          <div class="format-card">
            <div class="format-chip-header">
              <span class="format-icon img">IMG</span>
              <h4>Visual Documents</h4>
            </div>
            <p>High-resolution captures & receipts (.png, .jpg, .jpeg)</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Capabilities / Features -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-intro text-center">
          <span class="badge badge-orange">System Architecture</span>
          <h2>Engineered for High-Concurrency Document Operations</h2>
          <p>DocVault combines true streaming architecture with strict database constraints for absolute integrity.</p>
        </div>

        <div class="features-grid">
          <div class="card feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 16 12 12 8 16"></polyline>
                <line x1="12" y1="12" x2="12" y2="21"></line>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
              </svg>
            </div>
            <h3>GridFS Streaming Pipeline</h3>
            <p>Uploads and downloads stream chunks directly into MongoDB GridFS. Zero intermediate file buffering guarantees event-loop responsiveness.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Cryptographic SHA-256 Prevention</h3>
            <p>On-the-fly checksum hashing pairs with compound unique indexes to guarantee you never upload the same document twice.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Atomic Quota Enforcement</h3>
            <p>Guaranteed 20 active files per user via atomic MongoDB counter updates. Eliminates race conditions even under concurrent upload attempts.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>Instant Sub-Millisecond Search</h3>
            <p>Index-backed search by filename and description, paired with upload-date sorting and server-side database pagination.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <h3>User-Scoped Category Workspaces</h3>
            <p>Complete category CRUD. Safe cascade behavior ensures that deleting a category smoothly reassigns files to Uncategorized.</p>
          </div>

          <div class="card feature-card">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Argon2id & HTTP-Only Tokens</h3>
            <p>State-of-the-art password protection via Argon2id with 64 MB memory cost. Protected endpoints use HTTP-Only JWT cookies.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3-Step Workflow Section -->
    <section id="workflow" class="workflow-section">
      <div class="container">
        <div class="section-intro text-center">
          <span class="badge badge-green">Simple Workflow</span>
          <h2>From Upload to Retrieval in 3 Steps</h2>
          <p>No steep learning curve. Upload, organize, and retrieve your business records in seconds.</p>
        </div>

        <div class="workflow-grid">
          <div class="workflow-card">
            <div class="step-badge">1</div>
            <h4>Stream & Fingerprint</h4>
            <p>Select any supported document up to 1 MB. The backend streams chunks straight into GridFS while hashing bytes into a SHA-256 fingerprint.</p>
          </div>

          <div class="workflow-card">
            <div class="step-badge">2</div>
            <h4>Tag & Structure</h4>
            <p>Assign documents to default or custom categories like Contracts, Invoices, HR, and Reports with optional context descriptions.</p>
          </div>

          <div class="workflow-card">
            <div class="step-badge">3</div>
            <h4>Search & Download</h4>
            <p>Filter by categories, search by keywords, and stream files directly back to your machine with authentic MIME headers.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="cta-section">
      <div class="container cta-container text-center">
        <h2>Experience Modern Document Management</h2>
        <p>Get started with 20 active document slots and enterprise streaming storage.</p>
        <div class="cta-actions">
          <a routerLink="/signup" class="btn btn-accent btn-lg">
            <span>Create Free Account</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
          <a routerLink="/login" class="btn btn-outline btn-lg cta-outline">Sign In to Existing Account</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="public-footer">
      <div class="container footer-container">
        <div class="footer-brand">
          <div class="flex items-center gap-2">
            <div class="brand-badge-sm">📄</div>
            <strong class="footer-brand-title">DocVault Enterprise</strong>
          </div>
          <p class="footer-tagline">Secure, non-buffering document governance with GridFS storage and SHA-256 integrity.</p>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h5>Navigation</h5>
            <a routerLink="/">Home</a>
            <a href="#features">Capabilities</a>
            <a href="#workflow">Workflow</a>
          </div>
          <div class="footer-column">
            <h5>Account</h5>
            <a routerLink="/login">Sign In</a>
            <a routerLink="/signup">Register Free</a>
            <a routerLink="/dashboard">Workspace</a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">
        <div>© 2026 DocVault Enterprise Document Management System. All rights reserved. Free & Open-Source Architecture.</div>
      </div>
    </footer>
  `,
  styles: [`
    .public-header {
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 200;
      padding: 0.875rem 0;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-badge {
      width: 2.375rem;
      height: 2.375rem;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-dark-neutral);
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .brand-highlight {
      color: var(--color-primary);
      font-weight: 700;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .nav-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 0.25rem 0.5rem;
      transition: color var(--transition-fast);
    }
    .nav-link:hover {
      color: var(--color-primary);
    }
    .nav-divider {
      width: 1px;
      height: 1.25rem;
      background-color: var(--color-border);
      margin: 0 0.25rem;
    }
    .mobile-menu-btn {
      display: none;
      background: transparent;
      border: 1px solid var(--color-border);
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      color: var(--color-dark-neutral);
      cursor: pointer;
    }
    .mobile-drawer {
      display: none;
    }

    /* Hero Section */
    .hero-section {
      padding: 4.5rem 0 4rem;
      background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
      border-bottom: 1px solid var(--color-border);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 3.5rem;
      align-items: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.875rem;
      background-color: var(--color-primary-light);
      border: 1px solid #bfdbfe;
      color: var(--color-primary);
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      margin-bottom: 1.25rem;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--color-primary);
    }
    .hero-headline {
      font-size: 2.75rem;
      font-weight: 800;
      line-height: 1.18;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
      color: var(--color-dark-neutral);
    }
    .gradient-text {
      color: var(--color-primary);
    }
    .hero-description {
      font-size: 1.125rem;
      line-height: 1.6;
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
    }
    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .trust-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 2.5rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--color-border);
    }
    .metric-num {
      display: block;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-dark-neutral);
      letter-spacing: -0.02em;
    }
    .metric-label {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    /* Hero Visual Card */
    .visual-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-xl);
      border-top: 4px solid var(--color-primary);
    }
    .visual-card-top {
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 1rem;
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #94a3b8;
    }
    .status-indicator.active {
      background-color: var(--color-success);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }
    .visual-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-dark-neutral);
    }
    .visual-doc-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .visual-doc-item {
      padding: 0.75rem;
      background-color: #f8fafc;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
    }
    .doc-badge-icon {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-xs);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6875rem;
      font-weight: 800;
      color: #ffffff;
      flex-shrink: 0;
    }
    .doc-badge-icon.pdf { background-color: #dc2626; }
    .doc-badge-icon.docx { background-color: #2563eb; }
    .doc-badge-icon.xlsx { background-color: #059669; }
    .doc-badge-icon.img { background-color: #7c3aed; }
    .doc-title {
      font-size: 0.8125rem;
      color: var(--color-dark-neutral);
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
    }
    .doc-meta {
      font-size: 0.6875rem;
      color: var(--color-text-secondary);
    }
    .visual-card-bottom {
      margin-top: 1.25rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
    .audit-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 600;
      color: var(--color-primary);
    }

    /* Section Intros */
    .section-intro {
      max-width: 680px;
      margin: 0 auto 3rem;
    }
    .section-intro h2 {
      margin: 0.75rem 0;
      font-size: 2rem;
    }
    .text-center { text-align: center; }

    /* Problem Section */
    .problem-section {
      padding: 4.5rem 0;
      background-color: #ffffff;
      border-bottom: 1px solid var(--color-border);
    }
    .problem-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .problem-card {
      border-top: 3px solid #fecaca;
    }
    .error-icon {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--radius-sm);
      background-color: var(--color-danger-bg);
      color: var(--color-danger);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    /* Formats Section */
    .formats-section {
      padding: 4.5rem 0;
      background-color: #f8fafc;
      border-bottom: 1px solid var(--color-border);
    }
    .formats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .format-card {
      background-color: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .format-chip-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .format-icon {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-xs);
      font-size: 0.75rem;
      font-weight: 800;
      color: #ffffff;
    }
    .format-icon.pdf { background-color: #dc2626; }
    .format-icon.docx { background-color: #2563eb; }
    .format-icon.xlsx { background-color: #059669; }
    .format-icon.img { background-color: #7c3aed; }

    /* Features Section */
    .features-section {
      padding: 5rem 0;
      background-color: #ffffff;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .feature-card {
      height: 100%;
      border-radius: var(--radius-md);
    }
    .feature-icon-box {
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-sm);
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    /* Workflow Section */
    .workflow-section {
      padding: 4.5rem 0;
      background-color: #f8fafc;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    .workflow-card {
      background: #ffffff;
      padding: 2rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      position: relative;
    }
    .step-badge {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: var(--color-primary);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }

    /* CTA Section */
    .cta-section {
      padding: 5rem 0;
      background: linear-gradient(135deg, var(--color-dark-neutral) 0%, #1e293b 100%);
      color: #ffffff;
    }
    .cta-container h2 {
      color: #ffffff;
      font-size: 2.25rem;
      margin-bottom: 1rem;
    }
    .cta-container p {
      color: #94a3b8;
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }
    .cta-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .cta-outline {
      border-color: #475569;
      color: #ffffff;
      background-color: transparent;
    }
    .cta-outline:hover {
      background-color: #334155;
      color: #ffffff;
    }

    /* Footer */
    .public-footer {
      background-color: #ffffff;
      border-top: 1px solid var(--color-border);
      padding: 3.5rem 0 1.5rem;
    }
    .footer-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid var(--color-border);
    }
    .brand-badge-sm { font-size: 1.25rem; }
    .footer-brand-title { font-size: 1.125rem; color: var(--color-dark-neutral); }
    .footer-tagline { font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.5rem; max-width: 400px; }
    .footer-links {
      display: flex;
      gap: 3rem;
    }
    .footer-column h5 {
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-dark-neutral);
      margin-bottom: 0.75rem;
    }
    .footer-column a {
      display: block;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-bottom: 0.5rem;
    }
    .footer-column a:hover {
      color: var(--color-primary);
    }
    .footer-bottom {
      padding-top: 1.5rem;
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    /* Responsive Breakpoints */
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; gap: 2.5rem; }
      .workflow-grid { grid-template-columns: 1fr; }
      .hero-headline { font-size: 2.25rem; }
    }

    @media (max-width: 768px) {
      .desktop-nav { display: none; }
      .mobile-menu-btn { display: flex; }
      .mobile-drawer {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.5rem 1.5rem;
        background: #ffffff;
        border-bottom: 1px solid var(--color-border);
        gap: 0.75rem;
        animation: modalSlideUp 150ms ease-out;
      }
      .mobile-nav-link {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-primary);
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--color-border-subtle);
      }
      .mobile-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      .footer-container { grid-template-columns: 1fr; }
      .trust-metrics { grid-template-columns: 1fr; gap: 1rem; }
      .hero-actions { flex-direction: column; align-items: stretch; }
      .hero-actions .btn { width: 100%; }
    }
  `]
})
export class HomeComponent {
  mobileMenuOpen = false;

  constructor(public authService: AuthService) {}
}
