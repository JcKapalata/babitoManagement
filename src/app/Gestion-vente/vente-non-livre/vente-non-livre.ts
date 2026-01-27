import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VenteServices } from '../vente-services';
import { OrderAdmin } from '../../Models/order';
import { ViewVenteTable } from '../view-vente-table/view-vente-table';

@Component({
  selector: 'app-vente-non-livre',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    ViewVenteTable 
  ],
  templateUrl: './vente-non-livre.html',
  styleUrl: './vente-non-livre.css', // Utilise le même style ou importe celui de vente-en-cours
})
export class VenteNonLivre {
  private venteService = inject(VenteServices);
  
  // On filtre sur 'processing' pour les ventes non encore livrées mais en cours de traitement
  ventes$ = this.venteService.getVentesByStatus('processing');
}