import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user';

@Component({
  selector: 'app-login',
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
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const loginData: LoginRequest = this.loginForm.value;      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          this.loading = false;
          console.log('✅ Login exitoso, navegando al dashboard...');
          
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
          
          // Esperar un tick para que localStorage se actualice
          setTimeout(() => {
            console.log('🔑 Token guardado:', !!this.authService.getToken());
            this.router.navigate(['/dashboard']).then(success => {
              console.log('✅ Navegación completada:', success);
              if (!success) {
                console.error('❌ Navegación falló - forzando recarga');
                window.location.href = '/dashboard';
              }
            });
          }, 100);
        },
        error: (error: any) => {
          this.loading = false;
          let errorMessage = 'Error en el inicio de sesión';
          
          if (error.status === 401) {
            errorMessage = 'Credenciales inválidas';
          } else if (error.error?.detail) {
            errorMessage = error.error.detail;
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field === 'username' ? 'Usuario' : 'Contraseña'} es requerido`;
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}
