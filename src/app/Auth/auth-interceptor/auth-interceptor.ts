import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../../Profile/profile-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const router = inject(Router);
  const injector = inject(Injector); // Correction boucle NG0200

  const isApiUrl = req.url.startsWith(environment.apiUrl);
  const isLoginRequest = req.url.includes('/auth/login');

  let cloned = req;
  if (token && isApiUrl) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
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