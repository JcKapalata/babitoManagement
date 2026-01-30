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

  // ✅ ADAPTATION : On vérifie si la requête commence par ton URL API définie dans environment.ts
  // Cela couvre localhost en dev ET ton domaine réel en prod automatiquement.
  const isApiUrl = req.url.startsWith(environment.apiUrl) || 
                   req.url.includes('/manager/') ||
                   req.url.includes('127.0.0.1:5001') || 
                   req.url.includes('localhost:5001');
                   
  const isLoginRequest = req.url.includes('/auth/login');

  let cloned = req;
  // ✅ ADAPTATION : On s'assure que le token est envoyé uniquement si on cible l'API
  if (token && isApiUrl && !isLoginRequest) {
    cloned = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache', // Optionnel : évite des bugs de cache sur les données privées
        'Pragma': 'no-cache'
      }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // ✅ ADAPTATION : Si 401, cela signifie que le token est invalide/expiré
      if (error.status === 401 && !isLoginRequest) {
        console.warn('[AuthInterceptor] Session expirée, redirection...');
        const profileService = injector.get(ProfileService);
        profileService.clearProfile();
        
        // On évite de rediriger si on est déjà sur la page login
        if (!router.url.includes('/login')) {
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        }
      }
      return throwError(() => error);
    })
  );
};