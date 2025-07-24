import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/response';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/angular_Response.json';

  private itemsSubject = new BehaviorSubject<Item[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  public loadItemsFromFile(): Observable<Item[]> {
    return this.http.get<{ results: Item[] }>(this.dataUrl).pipe(
      map(res => res.results),
      catchError(err => {
        console.error('Problen In Load Data', err);
        return throwError(() => new Error('Data Load Is Faild'));
      })
    );
  }

  fetchAndStoreItems(): void {
    this.loadItemsFromFile().subscribe({
      next: items => this.itemsSubject.next(items),
      error: () => this.itemsSubject.next([])
    });
  }

  getItemById(id: string): Observable<Item | undefined> {
    return this.items$.pipe(
      map(items => items.find(item => item.imdbID === id))
    );
  }

  updateItem(item: Item): Observable<Item> {
    console.log('Updated:', item);
    alert("Title Is Update:  "+ item.Title)
    return of(item).pipe(delay(500)); 
  }
}
