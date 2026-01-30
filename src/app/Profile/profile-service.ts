import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, catchError, Observable, throwError, finalize, switchMap, take, tap, filter } from 'rxjs';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly firebaseAuth = inject(Auth);
  private readonly PROFILE_API = `${environment.apiUrl}/manager/profile`;

  // --- États Réactifs ---
  // Signal pour l'usage dans les templates (performant)
  currentUser = signal<Agent | null>(null);
  
  // Subject pour les flux asynchrones
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();
  
  isLoading = signal<boolean>(false);

  /**
   * INITIALISATION RÉACTIVE
   * Attend que Firebase soit prêt, puis charge le profil Backend.
   * C'est cette méthode que ton Guard doit appeler.
   */
  initAuth(): Observable<Agent | null> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.clearLocalData();
      return of(null);
    }

    this.isLoading.set(true);

    return authState(this.firebaseAuth).pipe(
      take(1), // On attend la première émission stable de Firebase
      switchMap(fbUser => {
        if (!fbUser) {
          return throwError(() => new Error('Session Firebase non trouvée'));
        }
        // Appel au backend
        return this.http.get<{ success: boolean, data: Agent }>(this.PROFILE_API);
      }),
      map(res => {
        if (res?.success && res.data) {
          this.updateLocalState(res.data);
          return res.data;
        }
        throw new Error('Réponse backend invalide');
      }),
      catchError((err) => {
        console.error('[ProfileService] Erreur Init:', err.message);
        this.clearLocalData();
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  /**
   * REFRESH : Rafraîchit les données depuis le serveur
   */
  refreshProfile(): Observable<Agent | null> {
    this.isLoading.set(true);
    return this.http.get<{ success: boolean, data: Agent }>(this.PROFILE_API).pipe(
      map(res => {
        if (res?.success && res.data) {
          this.updateLocalState(res.data);
          return res.data;
        }
        return null;
      }),
      catchError((err) => {
        console.error('[ProfileService] Refresh failed:', err);
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  /**
   * UPDATE : Met à jour les infos de l'agent
   */
  updateProfile(updatedData: Partial<Agent>): Observable<Agent | null> {
    return this.http.put<{ success: boolean, data: Agent }>(this.PROFILE_API, updatedData).pipe(
      map(res => {
        if (res.success && res.data) {
          this.updateLocalState(res.data);
          return res.data;
        }
        return null;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * CREATE : Ajoute un nouvel agent (via l'admin)
   */
  createAgent(payload: Partial<Agent>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/manager/agents`, payload).pipe(
      catchError(err => this.handleError(err))
    );
  }

  /**
   * SESSION MANAGEMENT
   */
  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    this.updateLocalState(agent);
  }

  clearProfile(): void {
    this.clearLocalData();
    this.router.navigate(['/login']);
  }

  private clearLocalData(): void {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.currentAgentSubject.next(null);
  }

  private updateLocalState(agent: Agent): void {
    this.currentUser.set(agent);
    this.currentAgentSubject.next(agent);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message || `Erreur serveur (${error.status})`;
    return throwError(() => new Error(message));
  }
}