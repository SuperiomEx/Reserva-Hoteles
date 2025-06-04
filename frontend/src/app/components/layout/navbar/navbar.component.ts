import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // ← Cambiar RouterLink por solo Router
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    // RouterLink,  si esta en el template  se descomenta
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    // Implementar navegación al perfil cuando esté disponible
    console.log('Navigate to profile');
  }

  navigateToSettings(): void {
    // Implementar navegación a configuración cuando esté disponible
    console.log('Navigate to settings');
  }

  getUserDisplayName(): string {
    if (this.currentUser?.first_name && this.currentUser?.last_name) {
      return `${this.currentUser.first_name} ${this.currentUser.last_name}`;
    }
    return this.currentUser?.username || 'Usuario';
  }

  getUserInitials(): string {
    if (this.currentUser?.first_name && this.currentUser?.last_name) {
      return `${this.currentUser.first_name.charAt(0)}${this.currentUser.last_name.charAt(0)}`.toUpperCase();
    }
    return this.currentUser?.username?.charAt(0).toUpperCase() || 'U';
  }
}
