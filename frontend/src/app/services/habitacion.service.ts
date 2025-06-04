import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/reservacion';
import { TipoHabitacion } from '../models/tipo-habitacion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private readonly API_URL = `${environment.apiUrl}/habitaciones`;
  private readonly TIPOS_URL = `${environment.apiUrl}/tipos-habitacion`;

  constructor(private http: HttpClient) { }

  // CRUD Habitaciones
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

  getById(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.API_URL}/${id}/`);
  }

  create(habitacion: Partial<Habitacion>): Observable<Habitacion> {
    return this.http.post<Habitacion>(`${this.API_URL}/`, habitacion);
  }

  update(id: number, habitacion: Partial<Habitacion>): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.API_URL}/${id}/`, habitacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  getDisponibles(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.API_URL}/disponibles/`);
  }

  // CRUD Tipos de Habitación
  getTipos(): Observable<TipoHabitacion[]> {
    return this.http.get<any>(`${this.TIPOS_URL}/`);
  }

  getTipoById(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(`${this.TIPOS_URL}/${id}/`);
  }

  createTipo(tipo: Partial<TipoHabitacion>): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(`${this.TIPOS_URL}/`, tipo);
  }

  updateTipo(id: number, tipo: Partial<TipoHabitacion>): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`${this.TIPOS_URL}/${id}/`, tipo);
  }

  deleteTipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.TIPOS_URL}/${id}/`);
  }
}
