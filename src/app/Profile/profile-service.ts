import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, map, of, catchError, Observable, throwError, tap } from 'rxjs';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/users`;

  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();

  constructor() {
    this.loadSessionFromServer();
  }

  getSnapshot(): Agent | null {
    return this.currentAgentSubject.value;
  }

  /**
   * RÉEL : Met à jour le Subject local (Navbar, etc.)
   */
  updateLocalAgent(agent: Agent) {
    this.currentAgentSubject.next(agent);
  }

  /**
   * RÉEL : Charge le profil connecté via le token (Route: /users/profile)
   */
  private loadSessionFromServer() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.http.get<{ success: boolean, data: Agent }>(`${this.API_URL}/profile`).pipe(
      map(res => res.success ? res.data : null),
      catchError(() => {
        this.clearProfile();
        return of(null);
      })
    ).subscribe(agent => {
      if (agent) this.currentAgentSubject.next(agent);
    });
  }

  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    this.currentAgentSubject.next(agent);
  }

  clearProfile(): void {
    localStorage.removeItem('auth_token');
    this.currentAgentSubject.next(null);
  }

  /**
   * RÉEL : Récupère n'importe quel profil par son ID (Admin only au back)
   */
  getAgentById(userId: string): Observable<Agent> {
    return this.http.get<{ success: boolean, data: Agent }>(`${this.API_URL}/${userId}`).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * RÉEL : Mise à jour (Route: PUT /users/profile pour soi-même ou /users/:id pour admin)
   */
  updateAgent(userId: string, updatedData: any): Observable<Agent> {
    // Si l'id est celui du connecté, on peut utiliser /profile, sinon /:id
    const url = this.getSnapshot()?.id === userId ? `${this.API_URL}/profile` : `${this.API_URL}/${userId}`;
    
    return this.http.put<{ success: boolean, data: Agent }>(url, updatedData).pipe(
      tap(res => {
        if (this.getSnapshot()?.id === userId) {
          this.updateLocalAgent(res.data);
        }
      }),
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * RÉEL : Création via la route Auth Register ou une route Admin
   */
  createAgent(payload: any): Observable<any> {
    // Pour la prod, on utilise souvent le register pour créer des agents
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || `Erreur serveur (${error.status})`;
    return throwError(() => new Error(message));
  }
}