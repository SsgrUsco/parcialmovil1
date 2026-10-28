import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InventoryItem, PhotoApi } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/photos';

  getItems(): Observable<InventoryItem[]> {
    const params = new HttpParams().set('_limit', 500);

    return this.http.get<PhotoApi[]>(this.apiUrl, { params }).pipe(
      map((photos) =>
        photos.map((photo) => ({
          ...photo,
          stock: (photo.id * 7) % 31,
        })),
      ),
    );
  }
}
