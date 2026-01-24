import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Obligatoire pour ngClass
import { Agent } from '../../Models/agent';
import { PersonnelService } from '../personnel-service';

@Component({
  selector: 'app-liste-agents',
  standalone: true,
  imports: [CommonModule], // Garde CommonModule pour [ngClass]
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
    this.isLoading.set(true);
    this.personnelService.getAllAgents().subscribe({
      next: (data) => {
        this.agents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  toggleStatus(agent: Agent): void {
    const newStatus = agent.status === 'banned' ? 'active' : 'banned';
    this.personnelService.updateAccountStatus(agent.id, newStatus, agent.role).subscribe({
      next: () => {
        this.agents.update(prev => prev.map(a => 
          a.id === agent.id ? { ...a, status: newStatus } : a
        ));
      },
      error: (err) => alert(err.message)
    });
  }

  onDelete(agentId: string): void {
    if (confirm('Voulez-vous supprimer cet agent ?')) {
      this.personnelService.deleteAgent(agentId).subscribe({
        next: () => {
          this.agents.update(prev => prev.filter(a => a.id !== agentId));
        },
        error: (err) => alert(err.message)
      });
    }
  }
}