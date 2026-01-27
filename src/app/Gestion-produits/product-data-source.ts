import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ProduitsService } from './produits-service';

export class ProductDataSource extends DataSource<any> {
  private _pageSize = 50;
  private _totalItems = 100;
  private _cachedData = Array.from<any>({ length: this._totalItems });
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(any | undefined)[]>(this._cachedData);
  private _subscription = new Subscription();

  public initialized = false;

  constructor(
    private productService: ProduitsService,
    private isRuptureMode: boolean = false // 👈 Nouveau: Détermine si on filtre les ruptures
  ) {
    super();
    console.log(`[DataSource] 🚀 Initialisée (Mode Rupture: ${this.isRuptureMode})`);
  }

  connect(collectionViewer?: CollectionViewer): Observable<(any | undefined)[]> {
    console.log('[DataSource] 🔗 Connectée au Viewport');
    this._subscription.add(
      collectionViewer?.viewChange.subscribe(range => {
        const startPage = Math.floor(range.start / this._pageSize);
        const endPage = Math.floor(range.end / this._pageSize);
        console.log(`[Scroll] 📜 Index ${range.start}-${range.end} | Pages: ${startPage} à ${endPage}`);

        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    return this._dataStream;
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) return;
    this._fetchedPages.add(page);

    console.log(`[API] 📡 Appel page ${page} (Mode Rupture: ${this.isRuptureMode})`);

    this.productService.getProduits(page, this._pageSize).subscribe({
      next: (response: any) => {
        let itemsToInsert = response.items || [];
        const totalCount = response.total;

        // --- LOGIQUE RUPTURE ---
        if (this.isRuptureMode) {
          const countAvant = itemsToInsert.length;
          itemsToInsert = this._extraireRuptures(itemsToInsert);
          console.log(`[Logique] 🔍 Page ${page}: ${countAvant} produits transformés en ${itemsToInsert.length} lignes de rupture`);
        }

        const start = page * this._pageSize;

        // Mise à jour de la taille totale du scroll
        if (this._totalItems !== totalCount) {
          console.log(`[Cache] 📏 Redimensionnement du scroll : ${totalCount} items`);
          this._totalItems = totalCount;
          // On ajuste la taille du tableau sans perdre les données existantes
          const newData = Array.from({ length: this._totalItems });
          this._cachedData.forEach((item, index) => { if(index < newData.length) newData[index] = item; });
          this._cachedData = newData;
        }

        // Insertion des données à la bonne place
        this._cachedData.splice(start, itemsToInsert.length, ...itemsToInsert);
        
        console.log(`[Update] ✅ Page ${page} insérée à l'index ${start}`);
        
        this.initialized = true;
        this._dataStream.next([...this._cachedData]);
      },
      error: (err) => console.error(`[API] ❌ Erreur page ${page}:`, err)
    });
  }

  // Cette fonction transforme un produit complexe en liste de lignes simples pour ton tableau
  private _extraireRuptures(produits: any[]): any[] {
    const listeRuptures: any[] = [];
    
    produits.forEach(p => {
      if (p.tailles) {
        Object.entries(p.tailles).forEach(([nomTaille, dataTaille]: [string, any]) => {
          if (dataTaille.couleurs) {
            dataTaille.couleurs.forEach((c: any) => {
              if (c.stock === 0) {
                listeRuptures.push({
                  produitId: p.id,
                  nomProduit: p.nom,
                  taille: nomTaille,
                  couleur: c.nom,
                  image: c.image || 'assets/placeholder.png'
                });
              }
            });
          }
        });
      }
    });
    
    return listeRuptures;
  }

  disconnect(): void {
    console.log('[DataSource] 🔌 Déconnexion');
    this._subscription.unsubscribe();
  }
}