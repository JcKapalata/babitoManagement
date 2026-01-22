import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, of, catchError, Observable, throwError, tap, finalize } from 'rxjs';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private router = inject(Router);

  /** * CONFIGURATION : Toutes les requêtes pointent vers le namespace Manager
   * pour interagir avec la collection 'agentManager' côté Backend.
   */
  private readonly MANAGER_API = `${environment.apiUrl}/manager`;

  // États réactifs (Signals pour la performance + Subject pour la compatibilité)
  currentUser = signal<Agent | null>(null);
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();

  isLoading = signal<boolean>(false);

  constructor() {
    this.loadSessionFromStorage();
  }

  /**
   * Retourne l'état actuel de l'agent sans souscription
   */
  getSnapshot(): Agent | null {
    return this.currentUser();
  }

  /**
   * Met à jour les données locales et le stockage persistant
   */
  updateLocalAgent(agent: Agent) {
    this.currentUser.set(agent);
    this.currentAgentSubject.next(agent);
    localStorage.setItem('auth_agent', JSON.stringify(agent));
  }

  /**
   * Initialisation de la session au chargement de l'application
   */
  private loadSessionFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const agentJson = localStorage.getItem('auth_agent');
    
    if (token && agentJson) {
      try {
        const cachedAgent = JSON.parse(agentJson) as Agent;
        this.currentUser.set(cachedAgent);
        this.currentAgentSubject.next(cachedAgent);
        
        // Rafraîchir les données depuis /manager/profile pour vérifier la validité
        this.refreshProfileFromServer();
      } catch {
        this.clearProfile();
      }
    }
  }

  /**
   * Récupère les données fraîches de l'agent connecté
   */
  private refreshProfileFromServer(): void {
    this.isLoading.set(true);
    this.http.get<{ success: boolean, data: Agent }>(`${this.MANAGER_API}/profile`).pipe(
      catchError(() => of(null)),
      finalize(() => this.isLoading.set(false))
    ).subscribe(res => {
      if (res?.success && res.data) {
        this.updateLocalAgent(res.data);
      }
    });
  }

  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_agent', JSON.stringify(agent));
    this.currentUser.set(agent);
    this.currentAgentSubject.next(agent);
  }

  clearProfile(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_agent');
    this.currentUser.set(null);
    this.currentAgentSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Récupère un agent spécifique du staff par son ID
   * (Utilisé par l'admin pour voir le profil d'un livreur ou autre agent)
   */
  getAgentById(agentId: string): Observable<Agent> {
    // Note: Utilise le endpoint générique manager pour le staff
    return this.http.get<{ success: boolean, data: Agent }>(`${this.MANAGER_API}/agents/${agentId}`).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un agent. 
   * Gère intelligemment si c'est le profil personnel ou celui d'un autre membre du staff.
   */
  updateAgent(agentId: string, updatedData: any): Observable<Agent> {
    const isSelf = this.getSnapshot()?.id === agentId;
    
    // Si self: /manager/profile | Si autre: /manager/accounts/:id/status
    const url = isSelf ? `${this.MANAGER_API}/profile` : `${this.MANAGER_API}/accounts/${agentId}/status`;
    
    return this.http.put<{ success: boolean, data: Agent }>(url, updatedData).pipe(
      tap(res => {
        if (isSelf && res.success) {
          this.updateLocalAgent(res.data);
        }
      }),
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  /**
   * Création d'un nouveau membre du staff (Admin, Livreur, Finance)
   */
  createAgent(payload: any): Observable<any> {
    return this.http.post<any>(`${this.MANAGER_API}/agents`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Suppression d'un agent du staff
   */
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