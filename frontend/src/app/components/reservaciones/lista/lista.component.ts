import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Reservacion, ReservacionCreate } from '../../../models/reservacion';
import { ReservacionService } from '../../../services/reservacion.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {
  reservaciones: Reservacion[] = [];
  loading = true;
  displayedColumns: string[] = ['numero_confirmacion', 'huesped', 'habitacion', 'fechas', 'estado', 'precio', 'acciones'];

  constructor(
    private reservacionService: ReservacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadReservaciones();
  }
  loadReservaciones(): void {
    this.loading = true;
    this.reservacionService.getAll().subscribe({
      next: (response: any) => {
        this.reservaciones = response.results || response;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.snackBar.open('Error al cargar reservaciones', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading reservaciones:', error);
      }
    });
  }

  cancelarReservacion(id: number): void {
    if (confirm('¿Está seguro de cancelar esta reservación?')) {
      this.reservacionService.update(id, { estado: 'cancelada' }).subscribe({
        next: () => {
          this.snackBar.open('Reservación cancelada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadReservaciones();
        },
        error: (error: any) => {
          this.snackBar.open('Error al cancelar reservación', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error canceling reservacion:', error);
        }
      });
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'confirmada';
      case 'en_curso':
        return 'completada';
      case 'completada':
        return 'completada';
      case 'cancelada':
        return 'cancelada';
      default:
        return 'pendiente';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'Confirmada';
      case 'en_curso':
        return 'En Curso';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  }

  getDays(fechaEntrada: string, fechaSalida: string): number {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    const diffTime = Math.abs(salida.getTime() - entrada.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
