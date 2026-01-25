import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VenteServices } from '../vente-services';
import { ViewVenteTable } from '../view-vente-table/view-vente-table';
import { OrderAdmin } from '../../Models/order';

@Component({
  selector: 'app-vente-en-cours',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    ViewVenteTable
  ],
  templateUrl: './vente-en-cours.html',
  styleUrl: './vente-en-cours.css',
})
export class VenteEnCours {
  private venteService = inject(VenteServices);
  
  ventes$ = this.venteService.getVentesRealtime();
  venteSelectionnee: OrderAdmin | null = null; // Pour stocker la vente à détailler

  ouvrirDetails(vente: OrderAdmin) {
    this.venteSelectionnee = vente;
  }


  changerStatut(id: string, statut: string) {
    this.venteService.updateStatus(id, statut).subscribe({
      next: () => {
        console.log('Statut mis à jour');
      },
      error: (err) => console.error('Erreur API:', err)
    });
  }
}