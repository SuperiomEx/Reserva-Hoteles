import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TipoHabitacion } from '../models/tipo-habitacion';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TiposHabitacionService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(`${this.API_URL}/tipos-habitacion/`, {
      headers: this.getAuthHeaders()
    });
  }

  getTipoHabitacion(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(`${this.API_URL}/tipos-habitacion/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  createTipoHabitacion(tipo: Partial<TipoHabitacion>): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(`${this.API_URL}/tipos-habitacion/`, tipo, {
      headers: this.getAuthHeaders()
    });
  }

  updateTipoHabitacion(id: number, tipo: Partial<TipoHabitacion>): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`${this.API_URL}/tipos-habitacion/${id}/`, tipo, {
      headers: this.getAuthHeaders()
    });
  }

  deleteTipoHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tipos-habitacion/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
