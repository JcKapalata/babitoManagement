import { ActivatedRoute, Router } from '@angular/router';
import { ProduitsService } from '../produits-service';
import { produits } from './../produits';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  produit: Produit | undefined;

  ngOnInit(): void {
    const ProduitId = this.route.snapshot.paramMap.get('id');
    if (ProduitId) {
      this.produitsServices.getProduitById(+ProduitId).subscribe({
        next: (produit) => {
          this.produit = produit;
          
          // SOLUTION : Force le rendu immédiat du HTML
          this.cdr.detectChanges(); 
          
          console.log('Produit chargé et affichage forcé');
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
  }

  goToListProduits() {
    this.router.navigate(['produits/produits-disponibles'])
  }
}
