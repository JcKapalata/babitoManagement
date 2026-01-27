import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../../Profile/profile-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const router = inject(Router);
  const injector = inject(Injector);

  // Vérifier si c'est une requête vers l'API
  const isApiUrl = req.url.includes('/api/') || req.url.includes('127.0.0.1:5001') || req.url.includes('localhost:5001');
  const isLoginRequest = req.url.includes('/auth/login');

  console.log('[AuthInterceptor] URL:', req.url);
  console.log('[AuthInterceptor] Token:', token ? 'Présent' : 'Absent');
  console.log('[AuthInterceptor] isApiUrl:', isApiUrl);
  console.log('[AuthInterceptor] isLoginRequest:', isLoginRequest);

  let cloned = req;
  if (token && isApiUrl && !isLoginRequest) {
    console.log('[AuthInterceptor] Ajout du token au header');
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[AuthInterceptor] Erreur:', error.status, error.message);
      // Si 401 ou 403 (Token expiré), on nettoie et on redirige
      if ([401, 403].includes(error.status) && !isLoginRequest) {
        const profileService = injector.get(ProfileService);
        profileService.clearProfile();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};