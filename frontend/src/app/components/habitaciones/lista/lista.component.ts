import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Habitacion } from '../../../models/habitacion';
import { HabitacionService } from '../../../services/habitacion.service';
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
    MatTooltipModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  loading = true;
  displayedColumns: string[] = ['numero', 'tipo', 'capacidad', 'precio', 'estado', 'disponible', 'acciones'];
  constructor(
    private habitacionService: HabitacionService
  ) {}

  ngOnInit() {
    this.loadHabitaciones();
  }
  loadHabitaciones(): void {
    this.loading = true;
    this.habitacionService.getAll().subscribe({
      next: (response: any) => {
        this.habitaciones = response.results || response;
        this.loading = false;
      },      error: (error: any) => {
        this.loading = false;
        console.error('Error al cargar habitaciones:', error);
      }
    });
  }  toggleDisponibilidad(id: number, disponible: boolean): void {
    const updateData: Partial<Habitacion> = { activa: !disponible };
    this.habitacionService.update(id, updateData).subscribe({      next: () => {
        console.log(`Habitación ${!disponible ? 'habilitada' : 'deshabilitada'} exitosamente`);
        this.loadHabitaciones();
      },
      error: (error: any) => {
        console.error('Error al actualizar habitación:', error);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'disponible';
      case 'ocupada':
        return 'ocupada';
      case 'mantenimiento':
        return 'mantenimiento';
      case 'limpieza':
        return 'limpieza';
      default:
        return 'disponible';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'Disponible';
      case 'ocupada':
        return 'Ocupada';
      case 'mantenimiento':
        return 'Mantenimiento';
      case 'limpieza':
        return 'Limpieza';
      default:
        return 'Disponible';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'individual':
        return 'Individual';
      case 'doble':
        return 'Doble';
      case 'matrimonial':
        return 'Matrimonial';
      case 'suite':
        return 'Suite';
      case 'familiar':
        return 'Familiar';
      default:
        return tipo;
    }
  }
}
