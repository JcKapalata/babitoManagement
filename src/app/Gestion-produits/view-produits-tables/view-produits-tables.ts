import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Produit } from '../../Models/produit';

@Component({
  selector: 'view-produits-tables',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './view-produits-tables.html',
  styleUrl: './view-produits-tables.css',
})
export class ViewProduitsTables {
  @Input() produits: Produit[] = [];

  // Liste complète des colonnes mise à jour
  displayedColumns: string[] = [
    'id', 
    'nom', 
    'taille', 
    'couleur', 
    'quantite', 
    'prix', 
    'devise', 
    'codeProduit', 
    'codeFournisseur', 
    'region',
    'classement',
    'categorie',
    'type',
    'dateAjout',
    'dateModification'
  ];

  // Helper pour extraire le prix (prend la première valeur disponible)
  getPrice(produit: Produit): number {
    const keys = Object.keys(produit.prix);
    return keys.length > 0 ? produit.prix[keys[0]] : 0;
  }
}