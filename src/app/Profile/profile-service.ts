import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, catchError, Observable, throwError, finalize } from 'rxjs';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private router = inject(Router);

  /**
   * Endpoints Manager pour interagir avec 'agentManager'
   */
  private readonly MANAGER_API = `${environment.apiUrl}/manager`;

  // Identité en mémoire vive (RAM) uniquement
  currentUser = signal<Agent | null>(null);
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();

  // Indicateur de chargement pour l'initialisation
  isLoading = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  /**
   * Initialisation : On vérifie s'il existe un token pour charger le profil
   */
  private initAuth(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.refreshProfileFromServer();
    }
  }

  /**
   * Récupère les données de l'agent depuis le serveur via le token
   * Route : GET /manager/profile
   */
  private refreshProfileFromServer(): void {
    this.isLoading.set(true);
    this.http.get<{ success: boolean, data: Agent }>(`${this.MANAGER_API}/profile`).pipe(
      catchError(() => {
        // Si le token est invalide ou expiré, on nettoie tout
        this.clearProfile();
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe(res => {
      if (res?.success && res.data) {
        this.currentUser.set(res.data);
        this.currentAgentSubject.next(res.data);
      }
    });
  }

  /**
   * Login : On enregistre UNIQUEMENT le token
   */
  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    
    // On remplit les états en mémoire pour usage immédiat
    this.currentUser.set(agent);
    this.currentAgentSubject.next(agent);
  }

  /**
   * Logout : Nettoyage du localStorage et de la mémoire
   */
  clearProfile(): void {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.currentAgentSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Snapshot de l'agent (depuis la mémoire vive)
   */
  getSnapshot(): Agent | null {
    return this.currentUser();
  }

  // --- GESTION ADMINISTRATIVE (Staff) ---

  createAgent(payload: any): Observable<any> {
    return this.http.post<any>(`${this.MANAGER_API}/agents`, payload).pipe(
      catchError(this.handleError)
    );
  }

  getAgentById(agentId: string): Observable<Agent> {
    return this.http.get<{ success: boolean, data: Agent }>(`${this.MANAGER_API}/agents/${agentId}`).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  updateAgent(agentId: string, updatedData: any): Observable<Agent> {
    const isSelf = this.getSnapshot()?.id === agentId;
    const url = isSelf ? `${this.MANAGER_API}/profile` : `${this.MANAGER_API}/accounts/${agentId}/status`;
    
    return this.http.put<{ success: boolean, data: Agent }>(url, updatedData).pipe(
      map(res => {
        if (isSelf && res.success) {
          // Si on s'est mis à jour soi-même, on rafraîchit la mémoire vive
          this.refreshProfileFromServer();
        }
        return res.data;
      }),
      catchError(this.handleError)
    );
  }

  deleteAgent(agentId: string): Observable<any> {
    return this.http.delete(`${this.MANAGER_API}/agents/${agentId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error?.message || `Erreur serveur (${error.status})`;
    return throwError(() => new Error(message));
  }
}