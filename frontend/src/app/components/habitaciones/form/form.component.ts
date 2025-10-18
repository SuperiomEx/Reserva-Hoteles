import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HabitacionService } from '../../../services/habitacion.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { TipoHabitacion } from '../../../models/tipo-habitacion';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  habitacionForm: FormGroup;
  tiposHabitacion: TipoHabitacion[] = [];
  loading = false;
  isEdit = false;
  habitacionId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.habitacionForm = this.fb.group({
      numero_habitacion: ['', Validators.required],
      tipo_habitacion: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadTiposHabitacion();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.habitacionId = +id;
      this.loadHabitacion(this.habitacionId);
    }
  }
  loadTiposHabitacion(): void {
    this.habitacionService.getTipos().subscribe({
      next: (tipos: any) => {
        // Manejar si la respuesta es un array directo o un objeto con results
        this.tiposHabitacion = Array.isArray(tipos) ? tipos : (tipos.results || []);
        console.log('✅ Tipos cargados:', this.tiposHabitacion);
      },
      error: (error: any) => {
        console.error('Error loading tipos:', error);
        this.tiposHabitacion = [];
        this.snackBar.open('Error al cargar tipos de habitación', 'Cerrar', { duration: 3000 });
      }
    });
  }
  loadHabitacion(id: number): void {
    this.habitacionService.getById(id).subscribe({
      next: (habitacion: any) => {
        this.habitacionForm.patchValue({
          numero_habitacion: habitacion.numero_habitacion,
          tipo_habitacion: typeof habitacion.tipo_habitacion === 'object' ? habitacion.tipo_habitacion.id : habitacion.tipo_habitacion,
          descripcion: habitacion.descripcion
        });
      },
      error: (error: any) => {
        console.error('Error loading habitacion:', error);
        this.snackBar.open('Error al cargar habitación', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/habitaciones']);
      }
    });
  }onSubmit(): void {
    if (this.habitacionForm.valid) {
      this.loading = true;
      const formData = {
        numero_habitacion: this.habitacionForm.value.numero_habitacion,
        tipo_habitacion: parseInt(this.habitacionForm.value.tipo_habitacion),
        descripcion: this.habitacionForm.value.descripcion || ''
      };

      console.log('📤 Enviando datos:', formData);

      const operation = this.isEdit && this.habitacionId
        ? this.habitacionService.update(this.habitacionId, formData)
        : this.habitacionService.create(formData);

      operation.subscribe({
        next: () => {
          this.loading = false;
          const message = this.isEdit ? 'Habitación actualizada exitosamente' : 'Habitación creada exitosamente';
          this.snackBar.open(message, 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/habitaciones']);
        },
        error: (error: any) => {
          this.loading = false;
          console.error('❌ Error saving habitacion:', error);
          console.error('❌ Error details:', error.error);
          let message = this.isEdit ? 'Error al actualizar habitación' : 'Error al crear habitación';
          
          // Mostrar errores específicos del backend
          if (error.error) {
            const errors = Object.entries(error.error)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
            message = errors || message;
          }
          
          this.snackBar.open(message, 'Cerrar', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.warn('⚠️ Formulario inválido:', this.habitacionForm.errors);
      Object.keys(this.habitacionForm.controls).forEach(key => {
        const control = this.habitacionForm.get(key);
        if (control?.invalid) {
          console.warn(`  - ${key}:`, control.errors);
        }
      });
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }
}
