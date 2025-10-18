import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'hotel_token';
  private readonly REFRESH_TOKEN_KEY = 'hotel_refresh_token';
  private readonly USER_KEY = 'hotel_user';

  // ✅ SOLUCIÓN: Solo cargar usuario si estamos en el browser
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    // ✅ Solo inicializar en el browser
    if (this.isBrowser()) {
      const user = this.getUserFromStorage();
      this.currentUserSubject.next(user);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          console.log('✅ Login response:', response);
          
          if (this.isBrowser()) {
            // La API de Django devuelve { token: "..." } con TokenAuthentication
            const token = (response as any).token || response.access;
            console.log('🔑 Token recibido:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
            
            if (token) {
              // Guardar con la clave correcta que usa HuespedService
              localStorage.setItem(this.TOKEN_KEY, token);
              console.log('💾 Token guardado en localStorage con clave:', this.TOKEN_KEY);
            } else {
              console.error('❌ No se recibió token en la respuesta');
            }
            
            // Si hay refresh token, guardarlo
            if (response.refresh) {
              localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh);
            }
            
            // Guardar usuario si viene en la respuesta
            if (response.user) {
              this.setUser(response.user);
              this.currentUserSubject.next(response.user);
            }
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register/`, userData)
      .pipe(
        tap(response => {
          if (this.isBrowser()) {
            this.setTokens(response.access, response.refresh);
            this.setUser(response.user);
          }
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      this.clearTokens();
      this.clearUser();
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }  getToken(): string | null {
    if (!this.isBrowser()) {
      console.log('⚠️ getToken() - No estamos en el browser');
      return null;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('🔍 getToken() llamado');
    console.log('  - Clave buscada:', this.TOKEN_KEY);
    console.log('  - Token encontrado:', token ? `SÍ (${token.substring(0, 20)}...)` : 'NO (null)');
    return token;
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Django Token Authentication: el token es una cadena simple, no JWT
    return !!token && token.length > 0;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(user: User): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearTokens(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  private clearUser(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.USER_KEY);
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser()) return null;
    
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  }
}
