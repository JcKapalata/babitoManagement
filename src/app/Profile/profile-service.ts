import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, catchError, Observable, throwError, finalize } from 'rxjs';
import { Auth, getIdToken } from '@angular/fire/auth';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly firebaseAuth = inject(Auth);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly PROFILE_API = `${environment.apiUrl}/manager/profile`;

  // États réactifs pour le profil de l'utilisateur connecté
  currentUser = signal<Agent | null>(null);
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();
  
  isLoading = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  /**
   * Initialisation au démarrage : charge le profil si un token existe
   */
  private initAuth(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.refreshProfileFromServer();
    }
  }

  /**
   * Cette méthode rafraîchit le profil sur ton serveur 
   * ET synchronise les droits avec Firebase Firestore.
   */
  refreshProfileFromServer(): void {
    this.isLoading.set(true);
    this.http.get<{ success: boolean, data: Agent }>(this.PROFILE_API).pipe(
      catchError(() => {
        this.clearProfile();
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe(async res => {
      if (res?.success && res.data) {
        this.currentUser.set(res.data);
        this.currentAgentSubject.next(res.data);

        // ✅ SYNCHRONISATION DES DROITS (Custom Claims)
        const user = this.firebaseAuth.currentUser;
        if (user) {
          try {
            // Correction de l'appel : getIdToken prend l'utilisateur en 1er argument
            // le 'true' force Firebase à régénérer le token avec les nouveaux rôles
            await getIdToken(user, true); 
            console.log("[Profile] 🔐 Droits Firestore synchronisés (Token rafraîchi)");
          } catch (e) {
            console.error("❌ Échec de la synchronisation Firestore :", e);
          }
        }
      }
    });
}

  /**
   * Met à jour ses propres informations
   */
  updateProfile(updatedData: Partial<Agent>): Observable<Agent | null> {
    return this.http.put<{ success: boolean, data: Agent }>(this.PROFILE_API, updatedData).pipe(
      map(res => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
          this.currentAgentSubject.next(res.data);
          return res.data;
        }
        return null;
      }),
      catchError(this.handleError)
    );
  }

  // A ADAPTER PLUTATARD DANS personnel-service.ts
 
  /**
   * Crée un nouvel agent (Admin, Vendeur ou Finance)
   */
    createAgent(payload: Partial<Agent>): Observable<any> {
      return this.http.post(`${environment.apiUrl}/manager/agents`, payload).pipe(
        catchError(this.handleError)
      );
    }

  /**
   * Enregistre la session après login
   */
  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    this.currentUser.set(agent);
    this.currentAgentSubject.next(agent);
  }

  /**
   * Déconnexion
   */
  clearProfile(): void {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.currentAgentSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || `Erreur profil (${error.status})`;
    return throwError(() => new Error(message));
  }
}