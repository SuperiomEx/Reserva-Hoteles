import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Huesped } from '../models/reservacion';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HuespedesService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getHuespedes(params?: any): Observable<{count: number, results: Huesped[]}> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<{count: number, results: Huesped[]}>(`${this.API_URL}/huespedes/`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  getHuesped(id: number): Observable<Huesped> {
    return this.http.get<Huesped>(`${this.API_URL}/huespedes/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  createHuesped(huesped: Partial<Huesped>): Observable<Huesped> {
    return this.http.post<Huesped>(`${this.API_URL}/huespedes/`, huesped, {
      headers: this.getAuthHeaders()
    });
  }

  updateHuesped(id: number, huesped: Partial<Huesped>): Observable<Huesped> {
    return this.http.put<Huesped>(`${this.API_URL}/huespedes/${id}/`, huesped, {
      headers: this.getAuthHeaders()
    });
  }

  deleteHuesped(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/huespedes/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  searchHuespedes(query: string): Observable<Huesped[]> {
    const params = new HttpParams().set('search', query);
    
    return this.http.get<Huesped[]>(`${this.API_URL}/huespedes/`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
