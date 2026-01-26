import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VenteServices } from '../vente-services';
import { ViewVenteTable } from '../view-vente-table/view-vente-table';

@Component({
  selector: 'app-vente-annuler',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    ViewVenteTable
  ],
  templateUrl: './vente-annuler.html',
  styleUrl: './vente-annuler.css',
})
export class VenteAnnuler {
  private venteService = inject(VenteServices);
  
  // Filtrage sur le statut des commandes annulées
  ventes$ = this.venteService.getVentesByStatus('cancelled'); 
}