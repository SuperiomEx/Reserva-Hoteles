import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Huesped } from '../../../models/reservacion';
import { HuespedService } from '../../../services/huesped.service';
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {
  huespedes: Huesped[] = [];
  loading = true;
  displayedColumns: string[] = ['nombre_completo', 'numero_identidad', 'correo_electronico', 'numero_contacto', 'acciones'];

  constructor(
    private huespedService: HuespedService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadHuespedes();
  }

  loadHuespedes(): void {
    this.loading = true;
    this.huespedService.getAll().subscribe({
      next: (response: any) => {
        this.huespedes = response.results || response;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.snackBar.open('Error al cargar huéspedes', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading huespedes:', error);
      }
    });
  }

  editarHuesped(huesped: Huesped): void {

    console.log('Editar huésped:', huesped);
  }

  eliminarHuesped(huesped: Huesped): void {
    if (confirm('¿Está seguro de eliminar este huésped?')) {
      this.huespedService.delete(huesped.id).subscribe({
        next: () => {
          this.snackBar.open('Huésped eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadHuespedes();
        },
        error: (error: any) => {
          this.snackBar.open('Error al eliminar huésped', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error deleting huesped:', error);
        }
      });
    }
  }
}
