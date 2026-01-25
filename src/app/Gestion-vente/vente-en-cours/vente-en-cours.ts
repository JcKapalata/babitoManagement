import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VenteServices } from '../vente-services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vente-en-cours',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './vente-en-cours.html',
  styleUrl: './vente-en-cours.css',
})
export class VenteEnCours {
  private venteService = inject(VenteServices);
  
  // Utilisation directe de l'observable
  ventes$ = this.venteService.getVentesRealtime();

  changerStatut(id: string, statut: string) {
    this.venteService.updateStatus(id, statut).subscribe({
      next: () => console.log('Statut mis à jour'),
      error: (err) => console.error('Erreur API:', err)
    });
  }
}