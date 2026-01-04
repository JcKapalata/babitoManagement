import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, catchError } from 'rxjs';
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
}