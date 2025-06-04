import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReservacionService } from '../../../services/reservacion.service';
import { HuespedService } from '../../../services/huesped.service';
import { HabitacionService } from '../../../services/habitacion.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { Huesped, Habitacion } from '../../../models/reservacion';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {
  reservacionForm: FormGroup;
  huespedes: Huesped[] = [];
  habitacionesDisponibles: Habitacion[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private reservacionService: ReservacionService,
    private huespedService: HuespedService,
    private habitacionService: HabitacionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.reservacionForm = this.fb.group({
      huesped: ['', Validators.required],
      habitacion: ['', Validators.required],
      fecha_llegada: ['', Validators.required],
      fecha_salida: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      metodo_pago: ['', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.loadHuespedes();
    this.loadHabitacionesDisponibles();
  }

  loadHuespedes(): void {
    this.huespedService.getAll().subscribe({
      next: (response: any) => {
        this.huespedes = response.results || response;
      },
      error: (error: any) => {
        console.error('Error loading huespedes:', error);
        this.snackBar.open('Error al cargar huéspedes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadHabitacionesDisponibles(): void {
    this.habitacionService.getDisponibles().subscribe({
      next: (habitaciones: any) => {
        this.habitacionesDisponibles = habitaciones;
      },
      error: (error: any) => {
        console.error('Error loading habitaciones:', error);
        this.snackBar.open('Error al cargar habitaciones disponibles', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.reservacionForm.valid) {
      this.loading = true;
      const formData = this.reservacionForm.value;
      
      // Format dates
      if (formData.fecha_llegada) {
        formData.fecha_llegada = formData.fecha_llegada.toISOString().split('T')[0];
      }
      if (formData.fecha_salida) {
        formData.fecha_salida = formData.fecha_salida.toISOString().split('T')[0];
      }

      this.reservacionService.create(formData).subscribe({
        next: (reservacion: any) => {
          this.loading = false;
          this.snackBar.open('Reservación creada exitosamente', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/reservaciones']);
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Error creating reservacion:', error);
          this.snackBar.open('Error al crear reservación', 'Cerrar', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
