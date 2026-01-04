import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agent } from '../Models/agent';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // Le BehaviorSubject stocke l'agent actuel (initialement nul)
  private currentAgentSubject = new BehaviorSubject<Agent | null>(null);
  
  // Observable que les composants vont écouter
  public currentAgent$: Observable<Agent | null> = this.currentAgentSubject.asObservable();

  constructor() {
    // Au démarrage, on regarde si un agent était déjà sauvé dans le navigateur
    const savedAgent = localStorage.getItem('active_agent');
    if (savedAgent) {
      this.currentAgentSubject.next(JSON.parse(savedAgent));
    }
  }

  // Cette méthode sera appelée par ton AuthService juste après un login réussi
  setAgent(agent: Agent): void {
    localStorage.setItem('active_agent', JSON.stringify(agent));
    this.currentAgentSubject.next(agent);
  }

  // Pour vider le profil à la déconnexion
  clearProfile(): void {
    localStorage.removeItem('active_agent');
    this.currentAgentSubject.next(null);
  }

  // Accès rapide à la valeur sans passer par un Observable
  get currentAgentValue(): Agent | null {
    return this.currentAgentSubject.value;
  }
}