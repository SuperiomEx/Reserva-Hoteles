import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Reservacion, 
  ReservacionCreate, 
  ReservacionFilter,
  DashboardData 
} from '../models/reservacion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  private readonly API_URL = `${environment.apiUrl}/reservaciones`;

  constructor(private http: HttpClient) { }

  // CRUD básico
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

  getById(id: number): Observable<Reservacion> {
    return this.http.get<Reservacion>(`${this.API_URL}/${id}/`);
  }

  create(reservacion: ReservacionCreate): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.API_URL}/`, reservacion);
  }

  update(id: number, reservacion: Partial<Reservacion>): Observable<Reservacion> {
    return this.http.put<Reservacion>(`${this.API_URL}/${id}/`, reservacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  // Funciones especiales
  getActivas(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/activas/`);
  }

  buscar(filtros: ReservacionFilter): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/buscar/`, filtros);
  }

  // Exportaciones
  exportarCSV(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/export_activas_csv/`, { 
      responseType: 'blob' 
    });
  }
}
