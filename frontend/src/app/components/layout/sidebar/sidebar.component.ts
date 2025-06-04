import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      name: 'Reservaciones',
      icon: 'event',
      route: '/reservaciones'
    },
    {
      name: 'Habitaciones',
      icon: 'meeting_room',
      route: '/habitaciones'
    },
    {
      name: 'Huéspedes',
      icon: 'people',
      route: '/huespedes'
    },
    {
      name: 'Reportes',
      icon: 'assessment',
      route: '/reportes'
    }
  ];

  constructor(private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
