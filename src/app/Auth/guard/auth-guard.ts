import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../Profile/profile-service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const profileService = inject(ProfileService);

  // On observe l'agent actuel dans le ProfileService
  return profileService.currentAgent$.pipe(
    take(1), // On prend la valeur actuelle et on ferme l'observation
    map(agent => {
      if (agent) {
        // L'agent existe en RAM (session valide chargée au démarrage)
        return true;
      } else {
        // Pas d'agent ou session expirée après vérification API
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          // On capture l'URL actuelle (ex: /profile/user-profile) pour y revenir plus tard
          console.warn(`Redirection : session absente pour ${state.url}`);
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        // Cas particulier : le token est là mais l'agent n'est pas encore chargé 
        // (ex: rafraîchissement de page). On peut autoriser temporairement 
        // car l'intercepteur gérera l'expulsion si le token est mauvais.
        return true; 
      }
    })
  );
};
