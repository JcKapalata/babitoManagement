import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Agent } from '../Models/agent';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonnelService {
  private readonly http = inject(HttpClient);
  
  // URL de base pour les actions de gestion (Backend: /api/manager)
  private readonly ADMIN_API = `${environment.apiUrl}/manager`;

  // ==========================================
  // 1. GESTION DES AGENTS (ADMIN SEULEMENT)
  // ==========================================

  /**
   * Liste tous les agents enregistrés dans la collection 'agentManager'
   */
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<{ success: boolean; data: Agent[] }>(`${this.ADMIN_API}/agents`).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouvel agent (Admin, Vendeur ou Finance)
   */
  createAgent(payload: Partial<Agent>): Observable<any> {
    return this.http.post(`${this.ADMIN_API}/agents`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprime définitivement un agent de la base
   */
  deleteAgent(agentId: string): Observable<any> {
    return this.http.delete(`${this.ADMIN_API}/agents/${agentId}`).pipe(
      catchError(this.handleError)
    );
  }

  // ==========================================
  // 2. GESTION DES CLIENTS (USERS)
  // ==========================================

  /**
   * Liste tous les clients (collection 'users')
   */
  getAllClients(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.ADMIN_API}/users`).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  // ==========================================
  // 3. STATUT ET SÉCURITÉ DES COMPTES
  // ==========================================

  /**
   * Change le statut d'un compte (Actif ou Banni)
   * On envoie le 'role' pour que le Backend sache dans quelle collection chercher
   */
  updateAccountStatus(id: string, status: 'active' | 'banned', role: string): Observable<any> {
    const payload = { status, role };
    return this.http.put(`${this.ADMIN_API}/accounts/${id}/status`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur administrative est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur retournée par le Backend (ex: 403, 404, 500)
      errorMessage = error.error?.message || `Code d'erreur : ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}