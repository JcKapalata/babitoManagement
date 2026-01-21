import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../../Profile/profile-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const isApiUrl = req.url.startsWith(environment.apiUrl);
  // Vérifier si la requête est une tentative de login
  const isLoginRequest = req.url.includes('/auth/login');

  let cloned = req;
  if (token && isApiUrl) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // SI 401/403 ET que ce n'est PAS un login -> Déconnexion
      if ([401, 403].includes(error.status) && !isLoginRequest) {
        console.error('Session expirée. Déconnexion...');
        profileService.clearProfile();
        router.navigate(['/login']);
      }
      // On renvoie l'erreur telle quelle pour que le AuthService la lise
      return throwError(() => error);
    })
  );
};