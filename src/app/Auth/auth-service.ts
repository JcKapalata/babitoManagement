import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, concatMap, finalize,from, map, of, switchMap, throwError } from 'rxjs';
import { User, Agent } from '../Models/agent'; 
import { AuthResponse } from '../Models/authResponse'; 
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ProfileService } from '../Profile/profile-service';
import { Auth, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL de l'API Manager
  private readonly MANAGER_API = `${environment.apiUrl}/manager`; 
  
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private profileService = inject(ProfileService);

  private firebaseAuth = inject(Auth);

  /**
   * Login : Flux réactif chaîné
   */
  login(email: string, password: string): Observable<Agent> {
    // 1. Authentification Firebase
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      // 2. Appel Backend typé avec AuthResponse
      switchMap((cred: UserCredential) => 
        this.http.post<AuthResponse>(`${this.MANAGER_API}/auth/login`, { email, password })
      ),
      map((response: AuthResponse) => {
        // On vérifie la présence du token et de l'utilisateur (user ou agent selon ton interface)
        const userData = response.user || response.agent;
        
        if (response.token && userData) {
          this.profileService.setSession(userData, response.token);
          return userData;
        }
        throw new Error('Données de session incomplètes en provenance du serveur');
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  /**
   * Logout : Flux réactif ordonné sans async/await
   */
  logout(): void {
    from(signOut(this.firebaseAuth)).pipe(
      concatMap(() => this.http.post<void>(`${this.MANAGER_API}/auth/logout`, {}).pipe(
        catchError(() => of(null)) // On continue même si l'invalidation JWT échoue
      )),
      finalize(() => {
        this.profileService.clearProfile();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
      })
    ).subscribe({
      next: () => console.log('[Auth] Déconnexion réussie'),
      error: (err) => console.error('[Auth] Erreur lors de la déconnexion', err)
    });
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