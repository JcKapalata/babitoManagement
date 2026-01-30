import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../Profile/profile-service';
import { Auth, authState } from '@angular/fire/auth'; // AJOUT
import { firstValueFrom } from 'rxjs'; // AJOUT

export const authGuard: CanActivateFn = async (_route, state) => {
  const profileService = inject(ProfileService);
  const firebaseAuth = inject(Auth); // On injecte Firebase
  const router = inject(Router);

  // 1. On vérifie d'abord si un token existe
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.log('❌ No token found, redirecting...');
    return router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  }

  // 2. Si rafraîchissement (F5) : On ré-initialise le profil Backend
  if (!profileService.currentUser()) {
    await profileService.initAuth();
  }

  // 3. ✅ CRUCIAL : On vérifie que Firebase est aussi connecté
  // authState permet de savoir si Firebase a reconnu l'utilisateur au démarrage
  const firebaseUser = await firstValueFrom(authState(firebaseAuth));

  if (profileService.currentUser() && firebaseUser) {
    console.log('✅ Auth guard: Double authentification validée (Backend + Firebase)');
    return true;
  }

  // 4. Sinon : Redirection car un des deux services est manquant
  console.log('❌ Auth guard: Auth incohérente, retour au login');
  return router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};