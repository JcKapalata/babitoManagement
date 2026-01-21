import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User, Agent } from '../Models/agent'; 
import { AuthResponse } from '../Models/authResponse'; 
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly AUTH_API = `${environment.apiUrl}/auth`; 
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /**
   * LOGIN
   * Le map ne s'exécute que si le statut est 2xx (Succès)
   */
  login(email: string, password: string): Observable<User> {
    if (!email || !password) {
      return throwError(() => new Error('Email et mot de passe requis'));
    }

    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, { email, password }).pipe(
      map(response => {
        // Le backend renvoie 'agent' et 'token' dans l'objet de réponse
        if (response.token && response.agent) {
          return {
            agent: response.agent as Agent,
            token: response.token
          };
        }
        throw new Error('Format de réponse invalide');
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  /**
   * GESTION DES ERREURS
   * Capture les messages d'erreur envoyés par le contrôleur Node.js
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur serveur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur réseau ou côté client
      errorMessage = error.error.message;
    } else {
      // Erreur envoyée par l'API (401, 403, 500)
      // On récupère le champ "message" défini dans ton backend
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}