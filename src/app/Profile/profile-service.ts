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

  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  public currentAgent$ = this.currentAgentSubject.asObservable();

  constructor() {
    this.loadSessionFromServer();
  }

  // Cette méthode "pousse" les nouvelles données à tous les composants qui écoutent
  updateLocalAgent(agent: Agent) {
    this.currentAgentSubject.next(agent);
  }

  // On récupère les infos depuis l'API In-Memory au démarrage
  private loadSessionFromServer() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // On simule une requête GET vers /users en filtrant par token
      this.http.get<User[]>(this.API_URL).pipe(
        map(users => users.find(u => u.token === token)),
        catchError(() => of(null)) // En cas d'erreur API
      ).subscribe(userFound => {
        if (userFound) {
          this.currentAgentSubject.next(userFound.agent);
        } else {
          this.clearProfile();
        }
      });
    }
  }

  // Stocke uniquement le token sur le disque, et l'agent en RAM (BehaviorSubject)
  setSession(agent: Agent, token: string): void {
    localStorage.setItem('auth_token', token);
    this.currentAgentSubject.next(agent);
  }

  clearProfile(): void {
    localStorage.removeItem('auth_token');
    this.currentAgentSubject.next(null);
  }

  //get User by Id
  getUserById(userId: number): Observable<User | undefined> {
    return this.http.get<User[]>(this.API_URL).pipe(
      tap( data => console.log('En DB actuellement:', data)),
      map(users => users.find(u => u.agent.id === userId)),
      catchError(err => {
        console.error('Erreur lors de la récupération de l\'utilisateur', err);
        return of(undefined);
      })
    );
  }

  //update Profile
  updateAgent(userId: number, updatedData: any): Observable<any> {
    const url = `${this.API_URL}/${userId}`;
    
    // LOG DE DÉBOGAGE AVANT ENVOI
    console.log(
      `%c[HTTP PUT REQUEST]%c Vers: ${url}`, 
      'color: #94D8B5',
      updatedData
    );

    return this.http.put(url, updatedData).pipe(
      tap(() => console.log(`%c[SUCCESS]%c Utilisateur ${userId} mis à jour`, 'color: green')),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const message = `Code ${error.status} : ${error.statusText || 'Non trouvé'}`;
    console.error(
      `%c[ERROR API]%c ${message}`, 
      'color: #d32f2f;'
    );
    return throwError(() => new Error(message));
  }

}