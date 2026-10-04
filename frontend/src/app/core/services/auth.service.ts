import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  
  public currentUser = signal<User | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const saved = localStorage.getItem('dms_user');
    return saved ? JSON.parse(saved) : null;
  }

  public getToken(): string | null {
    return localStorage.getItem('dms_token');
  }

  signup(data: { email: string; password: string; name: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data, { withCredentials: true }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  checkSession(): Observable<User | null> {
    return this.http.get<{ status: string; data: { user: User } }>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map(res => res.data.user),
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('dms_user', JSON.stringify(user));
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  private handleAuthSuccess(res: AuthResponse): void {
    if (res.data && res.data.user) {
      this.currentUser.set(res.data.user);
      localStorage.setItem('dms_user', JSON.stringify(res.data.user));
      if (res.data.token) {
        localStorage.setItem('dms_token', res.data.token);
      }
    }
  }

  private clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem('dms_user');
    localStorage.removeItem('dms_token');
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
