import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, from, map, of, switchMap, throwError } from 'rxjs';
import { User, Agent } from '../Models/agent'; 
import { AuthResponse } from '../Models/authResponse'; 
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ProfileService } from '../Profile/profile-service';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * On utilise le préfixe /manager configuré dans votre backend 
   * pour séparer les accès staff des accès clients.
   */
  private readonly MANAGER_API = `${environment.apiUrl}/manager`; 
  
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private profileService = inject(ProfileService);

  private firebaseAuth = inject(Auth);

  /**
   * Authentification côté Manager (Staff/Admin)
   * Route Backend: POST /manager/auth/login
   */
  login(email: string, password: string): Observable<User> {
    // 1. On lance d'abord la connexion Firebase (comme dans ton ancien code)
    // On transforme la promesse Firebase en Observable pour chaîner proprement
    const firebaseLogin$ = from(signInWithEmailAndPassword(this.firebaseAuth, email, password));

    return firebaseLogin$.pipe(
      switchMap(() => {
        // 2. Une fois Firebase connecté, on appelle ton Backend
        return this.http.post<any>(`${this.MANAGER_API}/auth/login`, { email, password });
      }),
      map(response => {
        if (response.token && response.user) {
          this.profileService.setSession(response.user, response.token);
          return { agent: response.user as Agent, token: response.token };
        }
        throw new Error('Erreur de session backend');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Déconnexion côté Manager
   * Route Backend: POST /manager/auth/logout
   */
  async logout(): Promise<void> {
    try {
      // 1. Déconnexion Firebase (Arrête les listeners temps réel de Firestore)
      await signOut(this.firebaseAuth);
      console.log('[Auth] Firebase Signed Out');

      // 2. Appel au Backend (pour invalider le JWT sur le serveur)
      // On utilise firstValueFrom pour attendre la réponse avant de vider le localstorage
      await firstValueFrom(
        this.http.post(`${this.MANAGER_API}/auth/logout`, {}).pipe(
          catchError(() => of(null)) // On continue même si le serveur met du temps à répondre
        )
      );

    } catch (error) {
      console.error('Erreur pendant la déconnexion:', error);
    } finally {
      // 3. Nettoyage local complet
      this.profileService.clearProfile();
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Redirection forcée
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
  
  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
  // 1. Message générique par défaut (Ne donne aucun indice sur la structure interne)
  let errorMessage = 'Une erreur est survenue lors de l\'authentification';

  // 2. Erreur réseau (Client-side ou problème DNS)
  if (error.status === 0) {
    errorMessage = 'Le service est momentanément indisponible. Veuillez réessayer plus tard.';
  } 
  
  // 3. Erreurs d'authentification (401) et d'autorisation (403)
  // On utilise le MÊME message pour les deux afin de ne pas aider un attaquant
  else if (error.status === 401 || error.status === 403) {
    // On ne précise pas si c'est l'email ou le mot de passe qui est faux
    errorMessage = 'Échec de la connexion. Vérifiez vos accès.';
  } 

  // 4. Erreur 404 (Not Found)
  else if (error.status === 404) {
    // On évite de confirmer que la route API existe ou non
    errorMessage = 'Ressource introuvable.';
  }

  // 5. Pour le mode production, on ne renvoie JAMAIS error.error.message du serveur
  // car il peut contenir des traces de la base de données ou du code Node.js
  else {
    errorMessage = 'email  ou mot de passe incorrect';
  }

  // Log interne (pour le développeur), mais l'utilisateur ne verra que errorMessage
  console.error(`[AuthLog] Code: ${error.status} | Details: ${error.error?.message || 'N/A'}`);

  return throwError(() => new Error(errorMessage));
}
}