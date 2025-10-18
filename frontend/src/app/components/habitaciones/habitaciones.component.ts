import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HabitacionService } from '../../services/habitacion.service';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule
  ],  template: `
    <div class="habitaciones-container">
      <div class="header">
        <h1>
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <mat-icon>hotel</mat-icon>
          Habitaciones
        </h1>
        <div class="actions">
          <div class="search-box">
            <mat-icon>search</mat-icon>
            <input type="text" placeholder="Buscar habitación..." [(ngModel)]="searchTerm" (input)="filterHabitaciones()">
          </div>
          <button mat-raised-button color="primary" routerLink="/habitaciones/crear">
            <mat-icon>add</mat-icon>
            Nueva Habitación
          </button>
        </div>
      </div>      <div class="habitaciones-grid" *ngIf="!loading && filteredHabitaciones.length > 0">
        <mat-card class="habitacion-card" *ngFor="let habitacion of filteredHabitaciones">
          <div class="card-header">
            <h2 class="room-number">{{ habitacion.numero_habitacion }}</h2>
            <p class="room-type">{{ habitacion.tipo_habitacion?.nombre || habitacion.tipo_habitacion }}</p>
            <span class="status-badge" [ngClass]="habitacion.estado?.toLowerCase() || 'disponible'">
              {{ habitacion.estado || 'Disponible' }}
            </span>
          </div>
          
          <mat-card-content class="card-content">
            <div class="info-row">
              <mat-icon>king_bed</mat-icon>
              <span class="info-label">Capacidad:</span>
              <span class="info-value">{{ habitacion.tipo_habitacion?.capacidad_personas || 'N/A' }} personas</span>
            </div>
            
            <div class="info-row">
              <mat-icon>info</mat-icon>
              <span class="info-label">Descripción:</span>
              <span class="info-value">{{ habitacion.descripcion || 'Sin descripción' }}</span>
            </div>
            
            <div class="price-tag" *ngIf="habitacion.tipo_habitacion?.precio_noche">
              {{ habitacion.tipo_habitacion.precio_noche | currency:'USD':'symbol':'1.0-0' }} / noche
            </div>
          </mat-card-content>
          
          <mat-card-actions class="card-actions">
            <button mat-button color="primary" (click)="editarHabitacion(habitacion.id); $event.stopPropagation()">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="confirmarEliminar(habitacion); $event.stopPropagation()">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-data" *ngIf="!loading && filteredHabitaciones.length === 0">
        <mat-icon>hotel</mat-icon>
        <p>No hay habitaciones registradas</p>
      </div>

      <div class="loading" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .habitaciones-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }    .header h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1a237e;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .back-button {
      color: #667eea;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background-color: rgba(102, 126, 234, 0.1);
      transform: translateX(-3px);
    }

    .habitaciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    .habitacion-card {
      border-radius: 16px;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #e9ecef;
    }

    .habitacion-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.12);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      position: relative;
    }

    .room-number {
      font-size: 36px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .status-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 8px 16px;
      border-radius: 24px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .price-tag {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      margin-top: 20px;
      font-size: 22px;
      font-weight: 700;    }
  `]
})
export class HabitacionesComponent implements OnInit {
  habitaciones: any[] = [];
  filteredHabitaciones: any[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private location: Location,
    private habitacionService: HabitacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHabitaciones();
  }

  goBack(): void {
    this.location.back();
  }

  loadHabitaciones(): void {
    this.loading = true;
    this.habitacionService.getAll().subscribe({
      next: (data: any) => {
        this.habitaciones = Array.isArray(data) ? data : (data.results || []);
        this.filteredHabitaciones = [...this.habitaciones];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading habitaciones:', error);
        this.habitaciones = [];
        this.filteredHabitaciones = [];
        this.loading = false;
      }
    });
  }
  filterHabitaciones(): void {
    if (!this.searchTerm) {
      this.filteredHabitaciones = [...this.habitaciones];
    } else {
      this.filteredHabitaciones = this.habitaciones.filter(h =>
        h.numero_habitacion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (h.tipo_habitacion?.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  editarHabitacion(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    console.log('Navegando a editar habitación:', id);
    this.router.navigate(['/habitaciones/editar', id]);
  }

  confirmarEliminar(habitacion: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (confirm(`¿Está seguro de eliminar la habitación ${habitacion.numero_habitacion}?`)) {
      this.habitacionService.delete(habitacion.id).subscribe({
        next: () => {
          alert('Habitación eliminada exitosamente');
          this.loadHabitaciones();
        },
        error: (error) => {
          console.error('Error eliminando habitación:', error);
          let errorMessage = 'Error al eliminar la habitación';
          
          if (error.error && typeof error.error === 'string') {
            if (error.error.includes('protected foreign keys') || error.error.includes('ProtectedError')) {
              errorMessage = 'No se puede eliminar esta habitación porque tiene reservaciones asociadas';
            }
          }
          
          alert(errorMessage);
        }
      });
    }
  }
}