import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservacion } from '../models/reservacion';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getReservaciones(params?: any): Observable<{count: number, results: Reservacion[]}> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<{count: number, results: Reservacion[]}>(`${this.API_URL}/reservaciones/`, {
      headers: this.getAuthHeaders(),
      params: httpParams
    });
  }

  getReservacion(id: number): Observable<Reservacion> {
    return this.http.get<Reservacion>(`${this.API_URL}/reservaciones/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  createReservacion(reservacion: Partial<Reservacion>): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.API_URL}/reservaciones/`, reservacion, {
      headers: this.getAuthHeaders()
    });
  }

  updateReservacion(id: number, reservacion: Partial<Reservacion>): Observable<Reservacion> {
    return this.http.put<Reservacion>(`${this.API_URL}/reservaciones/${id}/`, reservacion, {
      headers: this.getAuthHeaders()
    });
  }

  deleteReservacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/reservaciones/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  checkIn(id: number): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.API_URL}/reservaciones/${id}/checkin/`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  checkOut(id: number): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.API_URL}/reservaciones/${id}/checkout/`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  cancelReservacion(id: number): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.API_URL}/reservaciones/${id}/cancelar/`, {}, {
      headers: this.getAuthHeaders()
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
