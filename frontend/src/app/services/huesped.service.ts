import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Huesped } from '../models/reservacion';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HuespedService {
  private readonly API_URL = `${environment.apiUrl}/huespedes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService  ) { }
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('🔑 Token obtenido:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
      console.log('✅ Header Authorization configurado');
    } else {
      console.error('❌ NO HAY TOKEN - La petición fallará');
    }
    
    return headers;
  }

  getAll(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<any>(`${this.API_URL}/`, { 
      params: httpParams,
      headers: this.getHeaders()
    });
  }

  getById(id: number): Observable<Huesped> {
    return this.http.get<Huesped>(`${this.API_URL}/${id}/`, {
      headers: this.getHeaders()
    });
  }

  create(huesped: Partial<Huesped>): Observable<Huesped> {
    return this.http.post<Huesped>(`${this.API_URL}/`, huesped, {
      headers: this.getHeaders()
    });
  }

  update(id: number, huesped: Partial<Huesped>): Observable<Huesped> {
    return this.http.put<Huesped>(`${this.API_URL}/${id}/`, huesped, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`, {
      headers: this.getHeaders()
    });
  }

  search(query: string): Observable<Huesped[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<any>(`${this.API_URL}/`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      map(response => response.results || response)
    );
  }
}
