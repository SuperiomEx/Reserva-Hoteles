import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getHabitaciones(params?: any): Observable<{count: number, results: Habitacion[]}> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<{count: number, results: Habitacion[]}>(`${this.API_URL}/habitaciones/`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  getHabitacion(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.API_URL}/habitaciones/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  createHabitacion(habitacion: Partial<Habitacion>): Observable<Habitacion> {
    return this.http.post<Habitacion>(`${this.API_URL}/habitaciones/`, habitacion, {
      headers: this.getAuthHeaders()
    });
  }

  updateHabitacion(id: number, habitacion: Partial<Habitacion>): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.API_URL}/habitaciones/${id}/`, habitacion, {
      headers: this.getAuthHeaders()
    });
  }

  deleteHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/habitaciones/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  getHabitacionesDisponibles(fechaCheckin: string, fechaCheckout: string): Observable<Habitacion[]> {
    const params = new HttpParams()
      .set('fecha_checkin', fechaCheckin)
      .set('fecha_checkout', fechaCheckout)
      .set('disponible', 'true');

    return this.http.get<Habitacion[]>(`${this.API_URL}/habitaciones/`, {
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
