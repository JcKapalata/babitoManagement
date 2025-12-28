import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Produit } from '../../Models/produit';
import { ProductDataSource } from '../product-data-source';

@Component({
  selector: 'view-produits-tables',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './view-produits-tables.html',
  styleUrl: './view-produits-tables.css'
})
export class ViewProduitsTables {
  @Input({ required: true }) dataSource!: ProductDataSource;
  private router = inject(Router);

  // displayedColumns: string[] = [
  //   'id', 'nom', 'codeProduit', 'codeFournisseur', 'region',
  //   'classement', 'categorie', 'type', 'dateAjout', 'dateModification'
  // ];

  onRowClick(row: Produit | undefined) {
    if (row && row.id) {
      this.router.navigate(['produits/detail-produit/', row.id]);
    }
  }
}