import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created and default to unauthenticated when storage empty', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should store user and token on successful login', () => {
    const mockResponse = {
      status: 'success',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          name: 'Jane Doe',
          email: 'jane@enterprise.com',
          activeFileCount: 3
        }
      }
    };

    service.login({ email: 'jane@enterprise.com', password: 'Password123!' }).subscribe((res) => {
      expect(res.data.token).toBe('mock-jwt-token');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()?.name).toBe('Jane Doe');
      expect(localStorage.getItem('dms_token')).toBe('mock-jwt-token');
    });

    const req = httpTesting.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should clear session on logout', () => {
    localStorage.setItem('dms_token', 'mock-token');
    localStorage.setItem('dms_user', JSON.stringify({ id: '1', name: 'User', email: 'u@e.com', activeFileCount: 0 }));

    service.logout().subscribe(() => {
      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('dms_token')).toBeNull();
    });

    const req = httpTesting.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'success' });
  });
});
