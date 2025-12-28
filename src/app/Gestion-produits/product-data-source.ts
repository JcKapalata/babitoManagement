import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ProduitsService } from './produits-service';

export class MyProductDataSource extends DataSource<any> {
  private _pageSize = 50; // On réduit un peu pour plus de réactivité
  private _totalItems = 100; // On commence petit

  private _cachedData = Array.from<any>({ length: this._totalItems });
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(any | undefined)[]>(this._cachedData);
  private _subscription = new Subscription();



  constructor(private productService: ProduitsService) {
    super();
    console.log('✅ DataSource Initialisée');
  }

  connect(collectionViewer: CollectionViewer): Observable<(any | undefined)[]> {
    console.log('🔗 DataSource connectée au Viewport');
    
    this._subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        console.log(`scroll detecté : index ${range.start} à ${range.end}`);
        
        const startPage = Math.floor(range.start / this._pageSize);
        const endPage = Math.floor(range.end / this._pageSize);

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

    console.log(`📡 Appel API pour la page : ${page}`);

    this.productService.getProduits(page, this._pageSize).subscribe({
      next: (response: any) => {
        console.log(`📥 Réponse reçue pour page ${page}:`, response);
        
        const productsArray = response.items;
        const totalCount = response.total;

        if (productsArray && productsArray.length > 0) {
          const start = page * this._pageSize;

          this._totalItems = totalCount;
          if (this._cachedData.length !== this._totalItems) {
             this._cachedData = Array.from({length: this._totalItems}).map((_, i) => this._cachedData[i]);
          }

          this._cachedData.splice(start, productsArray.length, ...productsArray);
          
          console.log(`Update : ${productsArray.length} produits insérés à l'index ${start}`);
          this._dataStream.next([...this._cachedData]); // On envoie une copie pour forcer OnPush
        } else {
          console.warn(`⚠️ Page ${page} vide ou items manquants dans la réponse`);
        }
      },
      error: (err) => console.error(`❌ Erreur API sur page ${page}:`, err)
    });
  }

  private _evictFarPages(currentPage: number) {
    for (const page of this._fetchedPages) {
      if (Math.abs(page - currentPage) > 5) {
        const start = page * this._pageSize;
        // Remplace les objets par undefined pour que le Garbage Collector libère la RAM
        this._cachedData.fill(undefined, start, start + this._pageSize);
        this._fetchedPages.delete(page);
        console.log(`Page ${page} évincée pour libérer la mémoire.`);
      }
    }
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }
}