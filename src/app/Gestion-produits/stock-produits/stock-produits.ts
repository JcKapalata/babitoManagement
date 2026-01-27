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
  standalone: true,
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
  isLoading = true;

  ngOnInit(): void {
    console.log('[StockProduits] ✅ Composant initialisé');
    console.log('[StockProduits] displayProducts$ observable:', this.displayProducts$);
    // Initialisation de la source pour la structure
    this.dataSource = new ProductDataSource(this.produitsService, false);
    this.fetchAndFilterStock();
  }

  /**
   * Récupère les produits et applique le filtre de stock
   */
  private fetchAndFilterStock(): void {
    console.log('[StockProduits] Appel API...');
    const sub = this.produitsService.getProduits(0, 100).subscribe({
      next: (res) => {
        console.log('[StockProduits] Réponse reçue:', res);
        const items = res.items || [];
        console.log('[StockProduits] Items bruts:', items);
        
        // TEMPORAIRE: Afficher la structure du premier produit
        if (items.length > 0) {
          console.log('[StockProduits] Structure du premier produit:', JSON.stringify(items[0], null, 2));
        }
        
        // TEMPORAIRE: Afficher TOUS les produits sans filtre
        console.log('[StockProduits] Avant filtre:', items.length);
        const filtered = items; // PAS DE FILTRE POUR LE DEBUG
        console.log('[StockProduits] Après filtre:', filtered.length);

        this.filteredDataSubject.next(filtered);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[StockProduits] Erreur API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.destroy$.add(sub);
  }

  /**
   * Vérifie si un produit possède au moins une variante avec du stock > 0
   */
  private checkStockAvailability(p: Produit): boolean {
    if (!p.tailles) {
      console.warn('[StockProduits] Produit sans tailles:', p.nom);
      return false;
    }
    
    const hasStock = Object.values(p.tailles).some((t: any) => 
      t.couleurs && t.couleurs.some((c: any) => c.stock > 0)
    );
    
    if (!hasStock) {
      console.log('[StockProduits] Produit sans stock:', p.nom);
    }
    
    return hasStock;
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