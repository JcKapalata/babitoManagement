import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User, Agent } from '../Models/agent'; 
import { AuthResponse } from '../Models/authResponse'; 
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ProfileService } from '../Profile/profile-service';

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

  /**
   * Authentification côté Manager (Staff/Admin)
   * Route Backend: POST /manager/auth/login
   */
  login(email: string, password: string): Observable<User> {
    if (!email || !password) {
      return throwError(() => new Error('Email et mot de passe requis'));
    }

    return this.http.post<any>(`${this.MANAGER_API}/auth/login`, { email, password }).pipe(
      map(response => {
        /**
         * Le backend renvoie 'user' pour les connexions staff
         * On vérifie la présence du token et de l'objet user
         */
        if (response.token && response.user) {
          // Stockage via le ProfileService (SessionStorage/BehaviorSubject)
          this.profileService.setSession(response.user, response.token);
          
          console.log('[AuthService] Login successful:', response.user);
          
          return {
            agent: response.user as Agent,
            token: response.token
          };
        }
        throw new Error('Format de réponse invalide ou accès non autorisé');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Déconnexion côté Manager
   * Route Backend: POST /manager/auth/logout
   */
  logout(): void {
    // Appel optionnel au backend pour invalider le token si nécessaire
    this.http.post(`${this.MANAGER_API}/auth/logout`, {}).pipe(
      catchError(() => throwError(() => new Error('Erreur lors du logout serveur')))
    ).subscribe();

    // Nettoyage local immédiat
    this.profileService.clearProfile();
    sessionStorage.clear();
    localStorage.clear();
    
    // Redirection vers la page de login admin
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur (vérifiez votre connexion)';
    } else if (error.status === 401) {
      errorMessage = 'Identifiants incorrects';
    } else if (error.status === 403) {
      errorMessage = 'Accès interdit : vous n\'avez pas les droits nécessaires';
    } else {
      errorMessage = error.error?.message || 'Erreur serveur';
    }

    return throwError(() => new Error(errorMessage));
  }
}