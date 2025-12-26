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

  displayedColumns: string[] = [
    'id', 'nom', 'taille', 'couleur', 'quantite', 'prix', 
    'devise', 'codeProduit', 'codeFournisseur', 'region',
    'classement', 'categorie', 'type', 'dateAjout', 'dateModification'
  ];

  // Helper pour itérer sur les clés de l'objet taille (ex: '6-9 mois', 'M', 'L')
  getTailles(p: Produit): string[] {
    return Object.keys(p.taille);
  }
}