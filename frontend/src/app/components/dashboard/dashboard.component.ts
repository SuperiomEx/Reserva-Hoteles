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
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error al cargar datos del dashboard:', error);
      }
    });
  }  downloadReport(): void {
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
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}
