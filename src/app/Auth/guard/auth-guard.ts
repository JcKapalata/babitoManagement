import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../Profile/profile-service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // 1. On vérifie d'abord l'état en mémoire (Signal)
  const currentUser = profileService.currentUser();
  if (currentUser) {
    console.log('✅ Auth guard: User found in memory');
    return true;
  }

  // 2. Si rafraîchissement (F5) : On vérifie si un token existe
  const token = localStorage.getItem('auth_token');
  if (token) {
    console.log('✅ Auth guard: Token found, initializing profile...');
    // Attendre que le profil soit chargé
    await profileService.initAuth();
    
    // Vérifier que le profil a été chargé
    const loadedUser = profileService.currentUser();
    if (loadedUser) {
      console.log('✅ Auth guard: Profile loaded successfully');
      return true;
    }
  }

  // 3. Sinon : Redirection immédiate
  console.log('❌ Auth guard: No token or user, redirecting to login');
  return router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
};