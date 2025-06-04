import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';

import { ReportesService } from '../../services/reportes.service';
import { DashboardService } from '../../services/dashboard.service';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatNativeDateModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  reportTypes = [
    { value: 'ocupacion', label: 'Reporte de Ocupación' },
    { value: 'ingresos', label: 'Reporte de Ingresos' },
    { value: 'huespedes', label: 'Reporte de Huéspedes' },
    { value: 'habitaciones', label: 'Reporte de Habitaciones' }
  ];

  selectedReportType = 'ocupacion';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  loading = false;
  reportData: any = null;

  constructor(
    private reportesService: ReportesService,
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {
    // Set default date range (last 30 days)
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30);
  }

  ngOnInit() {
    this.generateReport();
  }

  generateReport(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.snackBar.open('Por favor selecciona las fechas', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.reportData = null;

    const params = {
      tipo: this.selectedReportType,
      fecha_inicio: this.formatDate(this.fechaInicio),
      fecha_fin: this.formatDate(this.fechaFin)
    };


    this.dashboardService.getStats().subscribe({
      next: (data: any) => {
        this.reportData = this.processReportData(data);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.snackBar.open('Error al generar reporte', 'Cerrar', { duration: 5000 });
        console.error('Error generating report:', error);
      }
    });
  }

  processReportData(data: any): any {
    switch (this.selectedReportType) {
      case 'ocupacion':
        return {
          title: 'Reporte de Ocupación',
          metrics: [
            { label: 'Habitaciones Ocupadas', value: data.habitaciones_ocupadas || 0 },
            { label: 'Habitaciones Disponibles', value: data.habitaciones_disponibles || 0 },
            { label: 'Tasa de Ocupación', value: `${data.tasa_ocupacion || 0}%` },
            { label: 'Total Habitaciones', value: data.total_habitaciones || 0 }
          ]
        };
      case 'ingresos':
        return {
          title: 'Reporte de Ingresos',
          metrics: [
            { label: 'Ingresos del Período', value: `$${data.ingresos_periodo || 0}` },
            { label: 'Reservaciones Confirmadas', value: data.reservaciones_confirmadas || 0 },
            { label: 'Promedio por Reservación', value: `$${data.promedio_reservacion || 0}` },
            { label: 'Total Huéspedes', value: data.total_huespedes || 0 }
          ]
        };
      case 'huespedes':
        return {
          title: 'Reporte de Huéspedes',
          metrics: [
            { label: 'Total Huéspedes', value: data.total_huespedes || 0 },
            { label: 'Nuevos Huéspedes', value: data.nuevos_huespedes || 0 },
            { label: 'Check-ins Hoy', value: data.checkins_hoy || 0 },
            { label: 'Check-outs Hoy', value: data.checkouts_hoy || 0 }
          ]
        };
      case 'habitaciones':
        return {
          title: 'Reporte de Habitaciones',
          metrics: [
            { label: 'Total Habitaciones', value: data.total_habitaciones || 0 },
            { label: 'Habitaciones Disponibles', value: data.habitaciones_disponibles || 0 },
            { label: 'En Mantenimiento', value: data.habitaciones_mantenimiento || 0 },
            { label: 'En Limpieza', value: data.habitaciones_limpieza || 0 }
          ]
        };
      default:
        return null;
    }
  }

  exportToPDF(): void {
    this.dashboardService.exportPDF().subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${this.selectedReportType}-${this.formatDate(new Date())}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Reporte PDF descargado', 'Cerrar', { duration: 3000 });
      },
      error: (error: any) => {
        this.snackBar.open('Error al generar PDF', 'Cerrar', { duration: 5000 });
        console.error('Error exporting PDF:', error);
      }
    });
  }

  exportToExcel(): void {
    this.dashboardService.exportExcel().subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${this.selectedReportType}-${this.formatDate(new Date())}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Reporte Excel descargado', 'Cerrar', { duration: 3000 });
      },
      error: (error: any) => {
        this.snackBar.open('Error al generar Excel', 'Cerrar', { duration: 5000 });
        console.error('Error exporting Excel:', error);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }


  get selectedReportTypeLabel(): string {
    const found = this.reportTypes.find(t => t.value === this.selectedReportType);
    return found ? found.label : '';
  }

  
  get currentDate(): Date {
    return new Date();
  }
}
