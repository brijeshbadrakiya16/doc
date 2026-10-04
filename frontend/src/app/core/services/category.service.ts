import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<{ status: string; data: { categories: Category[] } }>(this.apiUrl, { withCredentials: true }).pipe(
      map(res => res.data.categories)
    );
  }

  createCategory(category: { name: string; description?: string }): Observable<Category> {
    return this.http.post<{ status: string; data: { category: Category } }>(this.apiUrl, category, { withCredentials: true }).pipe(
      map(res => res.data.category)
    );
  }

  updateCategory(id: string, category: { name?: string; description?: string }): Observable<Category> {
    return this.http.put<{ status: string; data: { category: Category } }>(`${this.apiUrl}/${id}`, category, { withCredentials: true }).pipe(
      map(res => res.data.category)
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
