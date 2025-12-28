import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ProduitsService } from '../produits-service';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-produit-epuises',
  standalone: true,
  imports: [CommonModule, RouterModule, Loading, ScrollingModule],
  templateUrl: './produit-epuises.html',
  styleUrl: './produit-epuises.css',
})
export class ProduitEpuises implements OnInit, OnDestroy {
  private readonly produitsService = inject(ProduitsService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subscription();

  // On utilise any[] pour éviter les erreurs de type 'image' dans le template
  private readonly epuisesSubject = new BehaviorSubject<any[]>([]);
  readonly epuises$ = this.epuisesSubject.asObservable();

  ngOnInit(): void {
    this.loadEpuises();
  }

  private loadEpuises(): void {
    const sub = this.produitsService.getProduits(0, 100).subscribe({
      next: (res) => {
        const allVariants: any[] = [];
        const items = res.items || [];

        items.forEach((p: any) => {
          if (p.taille) {
            Object.entries(p.taille).forEach(([tailleNom, tailleData]: [string, any]) => {
              if (tailleData.couleurs) {
                tailleData.couleurs.forEach((c: any) => {
                  // On ne garde que ce qui est à stock 0 ou moins
                  if (c.stock <= 0) {
                    allVariants.push({
                      idUnique: `${p.id}-${tailleNom}-${c.nom}`, // Pour le trackBy
                      produitId: p.id,
                      codeProduit: p.codeProduit,
                      nom: p.nom,
                      image: c.image, 
                      taille: tailleNom,
                      couleur: c.nom,
                    });
                  }
                });
              }
            });
          }
        });

        this.epuisesSubject.next(allVariants);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('[Epuises] Erreur API:', err)
    });
    this.destroy$.add(sub);
  }

  goToDetailProduit(id: number): void {
    if (id) {
      this.router.navigate(['produits/detail-produit/', id]);
    }
  }

  // Correction de l'erreur NG0955 : Clé unique combinée
  trackByFn(index: number, item: any): string {
    return item ? item.idUnique : index.toString();
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}