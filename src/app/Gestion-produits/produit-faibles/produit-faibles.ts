import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms'; // Import crucial pour la zone de saisie
import { BehaviorSubject, Subscription } from 'rxjs';

import { ProduitsService } from '../produits-service';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-produit-faibles',
  standalone: true,
  imports: [CommonModule, RouterModule, Loading, ScrollingModule, FormsModule],
  templateUrl: './produit-faibles.html',
  styleUrl: './produit-faibles.css',
})
export class ProduitFaibles implements OnInit, OnDestroy {
  private readonly produitsService = inject(ProduitsService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subscription();

  // Limite par défaut
  seuilLimite: number = 5;

  private readonly faiblesSubject = new BehaviorSubject<any[]>([]);
  readonly faibles$ = this.faiblesSubject.asObservable();

  ngOnInit(): void {
    this.chargerProduitsFaibles();
  }

  // Cette méthode est appelée au chargement et à chaque modification de l'input
  chargerProduitsFaibles(): void {
    const sub = this.produitsService.getProduits(0, 100).subscribe({
      next: (res) => {
        const allVariants: any[] = [];
        const items = res.items || [];

        items.forEach((p: any) => {
          if (p.taille) {
            Object.entries(p.taille).forEach(([tailleNom, tailleData]: [string, any]) => {
              tailleData.couleurs?.forEach((c: any) => {
                // FILTRE : Entre 1 et la limite (on exclut 0 car c'est pour la page "épuisés")
                if (c.stock > 0 && c.stock <= this.seuilLimite) {
                  allVariants.push({
                    idUnique: `${p.id}-${tailleNom}-${c.nom}`,
                    produitId: p.id,
                    nom: p.nom,
                    image: c.image,
                    taille: tailleNom,
                    couleur: c.nom,
                    stock: c.stock
                  });
                }
              });
            });
          }
        });

        this.faiblesSubject.next(allVariants);
        this.cdr.detectChanges();
      }
    });
    this.destroy$.add(sub);
  }

  goToDetailProduit(id: number): void {
    this.router.navigate(['produits/detail-produit/', id]);
  }

  trackByFn(index: number, item: any): string {
    return item ? item.idUnique : index.toString();
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
