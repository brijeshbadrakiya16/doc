import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { SignupComponent } from './features/auth/signup.component';
import { PrivateLayoutComponent } from './shared/components/private-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DocumentsComponent } from './features/documents/documents.component';
import { DocumentDetailComponent } from './features/documents/document-detail.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protected Routes (Guarded by AuthGuard)
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'documents/:id', component: DocumentDetailComponent },
      { path: 'categories', component: CategoriesComponent }
    ]
  },

  // Fallback Route
  { path: '**', redirectTo: '' }
];
