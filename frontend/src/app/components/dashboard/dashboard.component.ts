import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// CAMBIA por imports directos:
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { DashboardService } from '../../services/dashboard.service';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { DashboardData, Reservacion } from '../../models/reservacion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;
  displayedColumns: string[] = ['id', 'huesped', 'habitacion', 'fechas', 'estado', 'total'];

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardData) => {
        // Asegurar que reservaciones_recientes siempre sea un array
        this.dashboardData = {
          ...data,
          reservaciones_recientes: data.reservaciones_recientes || [],
          habitaciones: data.habitaciones || { total: 0, disponibles: 0, ocupadas: 0, porcentaje_ocupacion: 0 },
          huespedes: data.huespedes || { total_activos: 0 },
          reservaciones: data.reservaciones || { activas: 0, check_ins_hoy: 0, check_outs_hoy: 0 },
          ingresos: data.ingresos || { mes_actual: 0 },
          ocupacion_por_tipo: data.ocupacion_por_tipo || []
        };
        this.loading = false;
        console.log('✅ Dashboard data cargada:', this.dashboardData);
      },
      error: (error: any) => {
        this.loading = false;
        console.error('❌ Error al cargar datos del dashboard:', error);
        // Inicializar con datos vacíos en caso de error
        this.dashboardData = {
          habitaciones: {
            total: 0,
            disponibles: 0,
            ocupadas: 0,
            porcentaje_ocupacion: 0
          },
          huespedes: {
            total_activos: 0
          },
          reservaciones: {
            activas: 0,
            check_ins_hoy: 0,
            check_outs_hoy: 0
          },
          ingresos: {
            mes_actual: 0
          },
          ocupacion_por_tipo: [],
          reservaciones_recientes: []
        };
      }
    });
  }downloadReport(): void {
    this.dashboardService.exportPDF().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reservaciones-activas.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error al descargar reporte:', error);
      }
    });
  }

  getEstadoClass(estado: string): string {
    if (!estado) return 'estado-pendiente';
    
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'checkin':
        return 'estado-checkin';
      case 'checkout':
        return 'estado-checkout';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return 'estado-pendiente';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
