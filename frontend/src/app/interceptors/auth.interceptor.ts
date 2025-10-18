import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Django REST Framework usa "Token" en lugar de "Bearer"
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Token ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
