import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DocumentItem, DocumentListResponse, DashboardStats } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = '/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(formData: FormData): Observable<DocumentItem> {
    return this.http.post<{ status: string; data: { document: DocumentItem } }>(this.apiUrl, formData, { withCredentials: true }).pipe(
      map(res => res.data.document)
    );
  }

  getDocuments(paramsObj?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortField?: string;
    sortOrder?: string;
  }): Observable<{ documents: DocumentItem[]; pagination: any }> {
    let params = new HttpParams();
    if (paramsObj) {
      if (paramsObj.page) params = params.set('page', paramsObj.page.toString());
      if (paramsObj.limit) params = params.set('limit', paramsObj.limit.toString());
      if (paramsObj.search) params = params.set('search', paramsObj.search);
      if (paramsObj.categoryId) params = params.set('categoryId', paramsObj.categoryId);
      if (paramsObj.sortField) params = params.set('sortField', paramsObj.sortField);
      if (paramsObj.sortOrder) params = params.set('sortOrder', paramsObj.sortOrder);
    }

    return this.http.get<DocumentListResponse>(this.apiUrl, { params, withCredentials: true }).pipe(
      map(res => res.data)
    );
  }

  getDocumentById(id: string): Observable<DocumentItem> {
    return this.http.get<{ status: string; data: { document: DocumentItem } }>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(res => res.data.document)
    );
  }

  downloadDocument(id: string, fileName: string): void {
    this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob',
      withCredentials: true
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
      }
    });
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<{ status: string; data: { stats: DashboardStats } }>(`${this.apiUrl}/stats`, { withCredentials: true }).pipe(
      map(res => res.data.stats)
    );
  }
}
