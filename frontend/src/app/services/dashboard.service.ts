import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/reservacion';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/reportes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getStats(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.API_URL}/dashboard/`, {
      headers: this.getAuthHeaders()
    });
  }

  exportPDF(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reservaciones-activas-pdf/`, {
      responseType: 'blob'
    });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reservaciones-activas-excel/`, {
      responseType: 'blob'
    });
  }
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }
}
