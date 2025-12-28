import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ProduitsService } from '../produits-service';
import { ProductDataSource } from '../product-data-source';
import { Produit } from '../../Models/produit';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-stock-produits',
  standalone: true, // Confirmé par l'usage de 'imports'
  imports: [CommonModule, ScrollingModule, Loading], 
  templateUrl: './stock-produits.html',
  styleUrl: './stock-produits.css',
})
export class StockProduits implements OnInit, OnDestroy {
  // --- Injections ---
  private readonly produitsService = inject(ProduitsService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // --- Propriétés ---
  private readonly destroy$ = new Subscription();
  private readonly filteredDataSubject = new BehaviorSubject<Produit[]>([]);
  
  // Observable utilisé par le pipe | async dans le HTML
  readonly displayProducts$: Observable<Produit[]> = this.filteredDataSubject.asObservable();
  
  dataSource!: ProductDataSource;

  ngOnInit(): void {
    // Initialisation de la source pour la structure
    this.dataSource = new ProductDataSource(this.produitsService, false);
    this.fetchAndFilterStock();
  }

  /**
   * Récupère les produits et applique le filtre de stock
   */
  private fetchAndFilterStock(): void {
    const sub = this.produitsService.getProduits(0, 100).subscribe({
      next: (res) => {
        const items = res.items || [];
        
        // Application du filtre de stock
        const filtered = items.filter(p => this.checkStockAvailability(p));

        this.filteredDataSubject.next(filtered);
        this.cdr.detectChanges(); // Notification explicite du changement
      },
      error: (err) => console.error('[StockProduits] Erreur API:', err)
    });

    this.destroy$.add(sub);
  }

  /**
   * Vérifie si un produit possède au moins une variante avec du stock > 0
   */
  private checkStockAvailability(p: Produit): boolean {
    if (!p.taille) return false;
    
    return Object.values(p.taille).some((t: any) => 
      t.couleurs && t.couleurs.some((c: any) => c.stock > 0)
    );
  }

  /**
   * Navigation vers le détail
   */
  onRowClick(row: Produit): void {
    if (row?.id) {
      this.router.navigate(['produits/detail-produit/', row.id]);
    }
  }

  /**
   * Optimisation pour le Virtual Scroll et le filtrage
   */
  trackByFn(index: number, p: Produit): number | string {
    return p ? p.id : index;
  }

  ngOnDestroy(): void {
    // Nettoyage automatique pour éviter les fuites de mémoire
    this.destroy$.unsubscribe();
  }
}