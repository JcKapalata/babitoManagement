import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from '../../Models/agent';
import { PersonnelService } from '../personnel-service';

@Component({
  selector: 'app-liste-agents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-agents.html',
  styleUrl: './liste-agents.css',
})
export class ListeAgents implements OnInit {
  private readonly personnelService = inject(PersonnelService);

  agents = signal<Agent[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    console.log('[Debug] Chargement de la liste des agents...');
    this.isLoading.set(true);
    
    this.personnelService.getAllAgents().subscribe({
      next: (data) => {
        console.table(data); // Affiche la liste sous forme de tableau dans la console
        this.agents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[Debug Error] Échec du chargement:', err);
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  toggleStatus(agent: Agent): void {
    // Debug crucial : Vérifier si status existe avant l'envoi
    console.log('[Debug] Agent avant Toggle:', {
      id: agent.id,
      currentStatus: agent.status,
      role: agent.role
    });

    const newStatus = agent.status === 'banned' ? 'active' : 'banned';
    
    console.log(`[Debug] Tentative de changement : ${agent.status} -> ${newStatus}`);

    this.personnelService.updateAccountStatus(agent.id, newStatus, agent.role).subscribe({
      next: (res) => {
        console.log('[Debug Server Response] Success:', res);
        
        this.agents.update(prev => prev.map(a => 
          a.id === agent.id ? { ...a, status: newStatus } : a
        ));
      },
      error: (err) => {
        console.error('[Debug Server Response] Error:', err);
        alert(err.message);
      }
    });
  }

  onDelete(agentId: string): void {
    if (confirm('Voulez-vous supprimer cet agent ?')) {
      console.log(`[Debug] Suppression de l'agent ID: ${agentId}`);
      
      this.personnelService.deleteAgent(agentId).subscribe({
        next: () => {
          console.log('[Debug] Agent supprimé localement');
          this.agents.update(prev => prev.filter(a => a.id !== agentId));
        },
        error: (err) => console.error('[Debug Error] Échec suppression:', err)
      });
    }
  }
}