import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../Profile/profile-service';

export const authGuard: CanActivateFn = (_route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // 1. On vérifie d'abord l'état en mémoire (Signal)
  const currentUser = profileService.currentUser();
  if (currentUser) {
    return true;
  }

  // 2. Si rafraîchissement (F5) : On vérifie si un token existe
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Le ProfileService a déjà chargé les données du localStorage 
    // dans son constructeur de manière synchrone.
    return true; 
  }

  // 3. Sinon : Redirection immédiate
  return router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};