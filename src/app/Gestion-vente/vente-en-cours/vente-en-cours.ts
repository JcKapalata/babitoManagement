import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VenteServices } from '../vente-services';
import { ViewVenteTable } from '../view-vente-table/view-vente-table';

@Component({
  selector: 'app-vente-en-cours',
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
  
  // On demande uniquement les ventes en attente (pending)
  ventes$ = this.venteService.getVentesByStatus('pending');

}