import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController
      .expectOne('https://jsonplaceholder.typicode.com/photos?_limit=500')
      .flush([
        {
          albumId: 1,
          id: 1,
          title: 'Producto de prueba',
          url: 'https://example.com/photo.jpg',
          thumbnailUrl: 'https://example.com/thumb.jpg',
        },
        {
          albumId: 2,
          id: 2,
          title: 'Otro producto',
          url: 'https://example.com/photo-2.jpg',
          thumbnailUrl: 'https://example.com/thumb-2.jpg',
        },
        {
          albumId: 1,
          id: 5,
          title: 'Producto con stock bajo',
          url: 'https://example.com/photo-5.jpg',
          thumbnailUrl: 'https://example.com/thumb-5.jpg',
        },
      ]);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters products by album and search term', () => {
    component.selectedAlbum = 1;
    component.searchTerm = 'PRUEBA';

    expect(component.filteredItems.map((item) => item.title)).toEqual([
      'Producto de prueba',
    ]);
  });

  it('calculates inventory totals and low stock', () => {
    expect(component.totalStock).toBe(25);
    expect(component.lowStockCount).toBe(1);
  });
});
