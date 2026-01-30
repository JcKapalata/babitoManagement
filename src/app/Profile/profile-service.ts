import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, catchError, Observable, throwError, finalize, firstValueFrom } from 'rxjs';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly firebaseAuth = inject(Auth);
  private readonly PROFILE_API = `${environment.apiUrl}/manager/profile`;

  // États réactifs pour le profil de l'utilisateur connecté
  currentUser = signal<Agent | null>(null);
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();
  
  isLoading = signal<boolean>(false);
  private initialized = false;

  constructor() {
    console.log('[ProfileService] Constructor called');
  }

  /**
   * Modifié pour inclure la vérification Firebase
   */
  async initAuth(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const token = localStorage.getItem('auth_token');
    
    // On attend deux choses : le profil API et l'état Firebase
    if (token) {
      try {
        await Promise.all([
          this.refreshProfileFromServer(),
          firstValueFrom(authState(this.firebaseAuth)) // ✅ On s'assure que Firebase est prêt
        ]);
      } catch (e) {
        console.error("Erreur d'initialisation", e);
      }
    }
  }

  /**
   * Rafraîchit le profil depuis le serveur
   * Retourne une Promise pour attendre la fin du chargement
   */
  refreshProfileFromServer(): Promise<void> {
    return new Promise((resolve) => {
      this.isLoading.set(true);
      
      this.http.get<{ success: boolean, data: Agent }>(this.PROFILE_API).pipe(
        catchError((error) => {
          console.error('[ProfileService] Error refreshing profile:', error);
          this.clearProfile();
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      ).subscribe(res => {
        if (res?.success && res.data) {
          this.currentUser.set(res.data);
          this.currentAgentSubject.next(res.data);
        }
        resolve();
      });
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

  /**
   * Crée un nouvel agent
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
    console.log('[ProfileService] Setting session...');
    localStorage.setItem('auth_token', token);
    this.currentUser.set(agent);
    this.currentAgentSubject.next(agent);
  }

  /**
   * Déconnexion
   */
  clearProfile(): void {
    console.log('[ProfileService] Clearing profile...');
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
