import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private readonly API_URL = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) { }

  // Generate reports
  generateOccupancyReport(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    return this.http.get(`${this.API_URL}/ocupacion/`, { params });
  }

  generateRevenueReport(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    return this.http.get(`${this.API_URL}/ingresos/`, { params });
  }

  generateGuestsReport(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    return this.http.get(`${this.API_URL}/huespedes/`, { params });
  }

  generateRoomsReport(): Observable<any> {
    return this.http.get(`${this.API_URL}/habitaciones/`);
  }

  // Export functions
  exportPDF(reportType: string, fechaInicio: string, fechaFin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('tipo', reportType)
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    
    return this.http.get(`${this.API_URL}/export/pdf/`, { 
      params, 
      responseType: 'blob' 
    });
  }

  exportExcel(reportType: string, fechaInicio: string, fechaFin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('tipo', reportType)
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    
    return this.http.get(`${this.API_URL}/export/excel/`, { 
      params, 
      responseType: 'blob' 
    });
  }

  // Generic report generation
  generateReport(reportType: string, fechaInicio: string, fechaFin: string): Observable<any> {
    switch (reportType) {
      case 'ocupacion':
        return this.generateOccupancyReport(fechaInicio, fechaFin);
      case 'ingresos':
        return this.generateRevenueReport(fechaInicio, fechaFin);
      case 'huespedes':
        return this.generateGuestsReport(fechaInicio, fechaFin);
      case 'habitaciones':
        return this.generateRoomsReport();
      default:
        throw new Error(`Tipo de reporte no soportado: ${reportType}`);
    }
  }
}
