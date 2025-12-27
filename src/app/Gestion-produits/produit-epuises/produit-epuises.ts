import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProduitsService } from '../produits-service';
import { Produit } from '../../Models/produit';
import { Loading } from "../../loading/loading";

export interface VarianteEpuisee {
  produitId: number;
  nomProduit: string;
  taille: string;
  couleur: string;
  image: string;
}

@Component({
  selector: 'app-produit-epuises',
  standalone: true,
  imports: [CommonModule, RouterModule, Loading],
  templateUrl: './produit-epuises.html',
  styleUrl: './produit-epuises.css',
})
export class ProduitEpuises implements OnInit {
  private produitsService = inject(ProduitsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  ruptures: VarianteEpuisee[] = [];
  isLoading = true; // On commence à true

  ngOnInit(): void {
    this.produitsService.getProduits(0, 500).subscribe({
      next: (res) => {
        if (res && res.items) {
          this.ruptures = this.extraireRuptures(res.items);
        } 
        
        // 1. On change l'état d'abord
        this.isLoading = false;
        
        // 2. On informe Angular du changement APRES
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private extraireRuptures(produits: Produit[]): VarianteEpuisee[] {
    const liste: VarianteEpuisee[] = [];
    produits.forEach(p => {
      if (p.taille) {
        Object.entries(p.taille).forEach(([nomTaille, dataTaille]) => {
          dataTaille.couleurs.forEach(c => {
            if (c.stock === 0) {
              liste.push({
                produitId: p.id,
                nomProduit: p.nom,
                taille: nomTaille,
                couleur: c.nom,
                image: c.image
              });
            }
          });
        });
      }
    });
    return liste;
  }
  
  // goToDetailProduit
  goToDetailProduit(id: number){
    this.router.navigate(['produits/detail-produit/', id])
  }

}