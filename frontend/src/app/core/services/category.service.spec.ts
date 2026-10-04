import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CategoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch categories and unwrap data.categories', () => {
    const mockCategories = [
      { id: 'cat-1', name: 'Legal', description: 'Contracts', fileCount: 2, createdAt: '2026-01-01' },
      { id: 'cat-2', name: 'Finance', description: 'Invoices', fileCount: 5, createdAt: '2026-01-02' }
    ];

    service.getCategories().subscribe((cats) => {
      expect(cats.length).toBe(2);
      expect(cats[0].name).toBe('Legal');
    });

    const req = httpTesting.expectOne('/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'success', data: { categories: mockCategories } });
  });

  it('should create category and unwrap data.category', () => {
    const newCat = { name: 'Engineering', description: 'Tech specs' };
    const mockCreated = { id: 'cat-3', ...newCat, fileCount: 0, createdAt: '2026-01-03' };

    service.createCategory(newCat).subscribe((cat) => {
      expect(cat.id).toBe('cat-3');
      expect(cat.name).toBe('Engineering');
    });

    const req = httpTesting.expectOne('/api/categories');
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'success', data: { category: mockCreated } });
  });
});
