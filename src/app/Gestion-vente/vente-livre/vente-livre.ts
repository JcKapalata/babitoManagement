import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VenteServices } from '../vente-services';
import { ViewVenteTable } from '../view-vente-table/view-vente-table';

@Component({
  selector: 'app-vente-livree',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    ViewVenteTable
  ],
  templateUrl: './vente-livre.html',
  styleUrl: './vente-livre.css',
})
export class VenteLivre {
  private venteService = inject(VenteServices);
  
  // Dans votre flux (Paiement à la livraison), 'paid' est l'étape finale
  ventes$ = this.venteService.getVentesByStatus('paid'); 
}