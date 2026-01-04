import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../Models/agent';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/users`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Simulation d'un GET pour vérifier la connexion
  login(email: string, password: string): Observable<User | undefined> {
    return this.http.get<User[]>(this.API_URL).pipe(
      map(users => users.find(u => u.agent.email === email && u.agent.password === password))
    );
  }

  // Exemple d'un POST (pour créer un nouvel agent par exemple)
  register(newUser: User): Observable<User> {
    return this.http.post<User>(this.API_URL, newUser);
  }

  logout() {
    // 1. Supprimer le token de sécurité
    localStorage.removeItem('auth_token');
    
    // 2. Rediriger vers la page de login
    this.router.navigate(['/login']);
  }
}