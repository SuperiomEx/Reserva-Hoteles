import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En el servidor, permitir el acceso (se manejará en el cliente)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = authService.getToken();
  console.log('🔒 AuthGuard - token exists:', !!token); // DEBUG
  console.log('🔒 AuthGuard - trying to access:', state.url); // DEBUG

  if (token) {
    console.log('🔒 AuthGuard - access granted'); // DEBUG
    return true;
  }

  console.log('🔒 AuthGuard - redirecting to login'); // DEBUG
  router.navigate(['/login']);
  return false;
};
