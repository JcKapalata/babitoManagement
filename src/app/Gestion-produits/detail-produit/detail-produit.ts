import { ActivatedRoute, Router } from '@angular/router';
import { ProduitsService } from '../produits-service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Produit } from '../../Models/produit';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-detail-produit',
  imports: [CommonModule, Loading],
  templateUrl: './detail-produit.html',
  styleUrl: './detail-produit.css',
})
export class DetailProduit implements OnInit {
  private produitsServices = inject(ProduitsService);
  private location = inject(Location);
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
    this.location.back()
  }
}
