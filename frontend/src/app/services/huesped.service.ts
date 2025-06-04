import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Huesped } from '../models/reservacion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HuespedService {
  private readonly API_URL = `${environment.apiUrl}/huespedes`;

  constructor(private http: HttpClient) { }

  getAll(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<any>(`${this.API_URL}/`, { params: httpParams });
  }

  getById(id: number): Observable<Huesped> {
    return this.http.get<Huesped>(`${this.API_URL}/${id}/`);
  }

  create(huesped: Partial<Huesped>): Observable<Huesped> {
    return this.http.post<Huesped>(`${this.API_URL}/`, huesped);
  }

  update(id: number, huesped: Partial<Huesped>): Observable<Huesped> {
    return this.http.put<Huesped>(`${this.API_URL}/${id}/`, huesped);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  search(query: string): Observable<Huesped[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<any>(`${this.API_URL}/`, { params }).pipe(
      map(response => response.results || response)
    );
  }
}
