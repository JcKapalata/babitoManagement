import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauView } from "../tableau-view/tableau-view";
import { PersonnelService } from '../personnel-service';
import { UserClient } from '../../Models/client';
import { Router } from '@angular/router';
@Component({
  selector: 'app-liste-clients',
  standalone: true,
  imports: [CommonModule, TableauView],
  templateUrl: './liste-clients.html',
  styleUrls: ['./liste-clients.css']
})
export class ListeClients implements OnInit {
  private personnelService = inject(PersonnelService);
  private router = inject(Router);

  // Utilisation des Signals comme dans ton HTML
  clients = signal<UserClient[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() { this.loadClients(); }

  loadClients() {
    this.isLoading.set(true);
    this.personnelService.getAllClients().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  goToDetailsPersonnel(id: string) {
    this.router.navigate(['manager/personnel-detail', id]);
  }

  toggleStatus(client: UserClient) {
    const newStatus = client.status === 'active' ? 'banned' : 'active';
    // On passe 'client' en rôle car c'est la page des clients
    this.personnelService.updateAccountStatus(client.id, newStatus, 'client').subscribe({
      next: () => this.loadClients(), // On rafraîchit la liste
      error: (err) => this.errorMessage.set(err.message)
    });
  }
}