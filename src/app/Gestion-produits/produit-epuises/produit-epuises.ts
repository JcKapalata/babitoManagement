import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProduitsService } from '../produits-service';
import { ProductDataSource } from '../product-data-source';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-produit-epuises',
  standalone: true,
  imports: [CommonModule, RouterModule, Loading, ScrollingModule],
  templateUrl: './produit-epuises.html',
  styleUrl: './produit-epuises.css',
})
export class ProduitEpuises implements OnInit {
  private produitsService = inject(ProduitsService);
  private router = inject(Router);
  
  // On utilise la DataSource pour gérer le milliard de données
  dataSource!: ProductDataSource;

  ngOnInit(): void {
    // La DataSource s'occupe de tout le chargement paginé
    this.dataSource = new ProductDataSource(this.produitsService, true);
  }

  goToDetailProduit(id: number | undefined) {
    if (id) {
      this.router.navigate(['produits/detail-produit/', id]);
    }
  }
}