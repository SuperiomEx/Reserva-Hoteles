import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HuespedService } from '../../../services/huesped.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

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
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit {
  huespedForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private huespedService: HuespedService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.huespedForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      numero_identidad: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      fecha_nacimiento: [''],
      nacionalidad: ['', [Validators.required]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      numero_contacto: ['', [Validators.required]]
    });
  }
  onSubmit(): void {
    if (this.huespedForm.valid) {
      this.loading = true;
      const formData = { ...this.huespedForm.value };
      
      console.log('📝 Datos a enviar:', formData);
      console.log('🔑 Token disponible:', localStorage.getItem('hotel_token') ? 'SÍ' : 'NO');
      
      // Formatear fecha si existe
      if (formData.fecha_nacimiento) {
        const date = new Date(formData.fecha_nacimiento);
        formData.fecha_nacimiento = date.toISOString().split('T')[0];
      }

      this.huespedService.create(formData).subscribe({
        next: () => {
          this.loading = false;
          console.log('✅ Huésped creado exitosamente');
          this.snackBar.open('Huésped creado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/huespedes']);
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Error completo:', error);
          console.error('📊 Status:', error.status);
          console.error('📄 Body:', error.error);
          
          let errorMessage = 'Error al crear el huésped';
          
          if (error.status === 403) {
            errorMessage = '🔒 Error 403: No tienes permisos. Token inválido o sesión expirada.';
            console.error('Token actual:', localStorage.getItem('hotel_token'));
          } else if (error.status === 401) {
            errorMessage = '🔐 Error 401: No autorizado. Por favor, inicia sesión nuevamente.';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else if (error.status === 400) {
            const details = JSON.stringify(error.error);
            errorMessage = `❌ Datos inválidos: ${details}`;
          } else if (error.error?.detail) {
            errorMessage = error.error.detail;
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 7000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.warn('⚠️ Formulario inválido');
      this.markFormGroupTouched();
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }
  private markFormGroupTouched(): void {
    Object.keys(this.huespedForm.controls).forEach(key => {
      const control = this.huespedForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos de diagnóstico
  checkAuth(): void {
    const token = localStorage.getItem('hotel_token');
    console.log('🔍 Verificación de autenticación:');
    console.log('- Token existe:', !!token);
    console.log('- Token (primeros 30 caracteres):', token ? token.substring(0, 30) + '...' : 'NO HAY TOKEN');
    console.log('- Todas las claves en localStorage:', Object.keys(localStorage));
    
    this.snackBar.open(
      token ? `✅ Token encontrado: ${token.substring(0, 20)}...` : '❌ No hay token guardado',
      'Cerrar',
      { duration: 5000 }
    );
  }

  testConnection(): void {
    console.log('🌐 Probando conexión con backend...');
    this.huespedService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Conexión exitosa:', data);
        this.snackBar.open('✅ Conexión exitosa con el backend', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ Error de conexión:', error);
        this.snackBar.open(`❌ Error: ${error.status} - ${error.message}`, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
