import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, map, of, catchError, Observable, throwError, tap } from 'rxjs';
import { Agent, User } from '../Models/agent';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/users`;

  // Gestionnaire de l'état de l'utilisateur connecté (RAM)
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();

  constructor() {
    this.loadSessionFromServer();
  }

  /**
   * Retourne la valeur actuelle de l'agent connecté sans Observable.
   * FIX: Utilise 'currentAgentSubject' qui est bien défini plus haut.
   */
  getSnapshot(): Agent | null {
    return this.currentAgentSubject.value;
  }

  /**
   * Pousse les nouvelles données vers les composants abonnés (ex: Navbar)
   */
  updateLocalAgent(agent: Agent) {
    this.currentAgentSubject.next(agent);
  }

  /**
   * Charge la session au démarrage via le token stocké
   */
  private loadSessionFromServer() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      this.http.get<User[]>(this.API_URL).pipe(
        map(users => users.find(u => u.token === token)),
        catchError(() => of(null))
      ).subscribe(userFound => {
        if (userFound) {
          this.currentAgentSubject.next(userFound.agent);
        } else {
          this.clearProfile();
        }
      });
    }
  }

  /**
   * Initialise une session lors du Login
   */
  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    this.currentAgentSubject.next(agent);
  }

  /**
   * Déconnexion / Nettoyage du profil
   */
  clearProfile(): void {
    localStorage.removeItem('auth_token');
    this.currentAgentSubject.next(null);
  }

  /**
   * Récupère un utilisateur spécifique par son ID
   */
  getUserById(userId: number): Observable<User | undefined> {
    return this.http.get<User[]>(this.API_URL).pipe(
      tap( data => console.log('En DB actuellement:', data)),
      map(users => users.find(u => u.agent.id === userId)),
      catchError(err => {
        console.error('Erreur récupération utilisateur', err);
        return of(undefined);
      })
    );
  }

  /**
   * Met à jour les données sur le serveur (In-Memory)
   */
  updateAgent(userId: number, updatedData: any): Observable<any> {
    const url = `${this.API_URL}/${userId}`;
    console.log(`%c[HTTP PUT REQUEST]%c Vers: ${url}`, 'color: #94D8B5', updatedData);

    return this.http.put(url, updatedData).pipe(
      tap(() => console.log(`%c[SUCCESS]%c Utilisateur ${userId} mis à jour`, 'color: green')),
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouvel agent en base de données
   */
  createAgent(userPayload: any): Observable<any> {
    return this.http.post<any>(this.API_URL, userPayload).pipe(
      map(user => {
        if (user && user.agent && !user.agent.id) {
          user.agent.id = user.id;
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gestionnaire d'erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    const message = `Code ${error.status} : ${error.statusText || 'Non trouvé'}`;
    console.error(`%c[ERROR API]%c ${message}`, 'color: #d32f2f;');
    return throwError(() => new Error(message));
  }
}