import { ActivatedRoute, Router } from '@angular/router';
import { ProduitsService } from '../produits-service';
import { produits } from './../produits';
import { Component, inject, OnInit } from '@angular/core';
import { Produit } from '../../Models/produit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-produit',
  imports: [CommonModule],
  templateUrl: './detail-produit.html',
  styleUrl: './detail-produit.css',
})
export class DetailProduit implements OnInit {
  private produitsServices = inject(ProduitsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  produit: Produit | undefined;

  ngOnInit(): void {
    const ProduitId = this.route.snapshot.paramMap.get('id');
    if (ProduitId) {
      this.produitsServices.getProduitById(+ProduitId).subscribe({
        next: (produit) => {
          this.produit = produit;
          console.table(this.produit);
        },
        error: (error) => {
          console.error('Erreur lors du chargement du produit:', error);
        }
      });
    }
  }

  goToListProduits() {
    this.router.navigate(['produits/produits-disponibles'])
  }
}
