import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Produit } from '../../Models/produit';
import { Router } from '@angular/router';

@Component({
  selector: 'view-produits-tables',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './view-produits-tables.html',
  styleUrl: './view-produits-tables.css',
})
export class ViewProduitsTables {
  @Input() produits: Produit[] = [];
  private router = inject(Router);

  // Liste des colonnes simplifiée : plus d'imbrication complexe
  displayedColumns: string[] = [
    'id', 
    'nom', 
    'codeProduit', 
    'codeFournisseur', 
    'region',
    'classement', 
    'categorie', 
    'type', 
    'dateAjout', 
    'dateModification'
  ];

  onRowClick(row: Produit) {
    if (row && row.id) {
      this.router.navigate(['produits/detail-produit/', row.id]);
    }
  }
}