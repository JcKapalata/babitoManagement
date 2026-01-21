import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../Profile/profile-service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const profileService = inject(ProfileService);
  const token = localStorage.getItem('auth_token');

  // 1. Si aucun token n'est présent, on bloque immédiatement
  if (!token) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2. Si un token existe, on vérifie l'état de l'agent en mémoire
  return profileService.currentAgent$.pipe(
    take(1),
    map(agent => {
      // Si l'agent est chargé ou si on attend sa validation (token présent), on laisse passer.
      // L'intercepteur HTTP gérera l'expulsion (401) si le token s'avère invalide.
      return true; 
    })
  );
};