import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // On vérifie la présence du token
  const token = localStorage.getItem('auth_token');

  if (token) {
    // Si le token existe, on autorise l'accès à la route
    return true;
  } else {
    // Sinon, on redirige vers la page de login
    console.warn('Accès refusé : Aucun token trouvé. Redirection...');
    router.navigate(['/login']);
    return false;
  }
};
