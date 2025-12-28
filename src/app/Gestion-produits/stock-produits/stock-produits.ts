import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProduitsService } from '../produits-service';
import { Loading } from "../../loading/loading";
import { ProductDataSource } from '../product-data-source';
import { Produit } from '../../Models/produit';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-stock-produits',
  imports: [CommonModule, ScrollingModule, Loading], 
  templateUrl: './stock-produits.html',
  styleUrl: './stock-produits.css',
})
export class StockProduits implements OnInit {
  private produitsService = inject(ProduitsService);
  private router = inject(Router);
 

  private cdr = inject(ChangeDetectorRef);
  
  // 1. On crée notre propre flux de données
  private filteredData$ = new BehaviorSubject<any[]>([]);
  // 2. C'est ce flux que le HTML va lire
  displayProducts$ = this.filteredData$.asObservable();

  dataSource!: ProductDataSource;

  ngOnInit() {
    this.dataSource = new ProductDataSource(this.produitsService, false);

    // 3. On appelle l'API directement
    this.produitsService.getProduits(0, 100).subscribe(res => {
      const rawItems = res.items || [];
      console.log(`[Étape 1] API a renvoyé ${rawItems.length} produits`);

      // 4. On filtre ici, manuellement
      const filtered = rawItems.filter((p: any) => {
        try {
          return Object.values(p.taille || {}).some((t: any) => 
            t.couleurs && t.couleurs.some((c: any) => c.stock > 0)
          );
        } catch (e) { return false; }
      });

      console.log(`[Étape 2] Après filtre stock: ${filtered.length} produits restants`);

      // 5. On envoie les données au flux de l'écran
      this.filteredData$.next(filtered);
      
      // 6. On force Angular à dessiner
      this.cdr.detectChanges();
    });
  }

  onRowClick(row: any) {
    if (row && row.id) {
      this.router.navigate(['produits/detail-produit/', row.id]);
    }
  }

  // Très important pour la performance avec le filtrage
  trackByFn(index: number, p: any) {
    return p ? p.id : index;
  }
}