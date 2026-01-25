import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, retry, shareReplay, switchMap, throwError, tap } from 'rxjs';
import { Produit } from '../Models/produit';
import { environment } from '../../environments/environment';

export interface PaginatedProduits {
  items: Produit[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  private readonly API_URL = `${environment.apiUrl}/manager/produits`;
  private readonly http = inject(HttpClient);
  
  // Signal de rafraîchissement
  private refreshSignal$ = new BehaviorSubject<void>(undefined);

  // Récupérer la liste des produits avec pagination
  getProduits(page: number = 0, size: number = 20): Observable<PaginatedProduits> {
    // Pour le debug, on va d'abord tester sans paramètres pour prouver que les données arrivent
    return this.refreshSignal$.pipe(
      switchMap(() => {
        // NOTE: Si vous utilisez In-Memory, les paramètres 'page' et 'size' 
        // bloquent souvent la réponse. On les enlève pour le test.
        return this.http.get<any>(this.API_URL).pipe(
          retry(1),
          map(res => {
            // Extraction des données (gestion tableau direct ou objet)
            let items: Produit[] = Array.isArray(res) ? res : (res.data || res.items || []);

            // Puisque In-Memory ne gère pas nativement votre pagination 'page/size',
            // on le fait manuellement ici pour le développement :
            const start = page * size;
            const end = start + size;
            const paginatedItems = items.slice(start, end);

            console.log(`[Debug] Total items: ${items.length}, Paginated: ${paginatedItems.length}`);

            return {
              items: this.parseDates(paginatedItems),
              total: items.length
            };
          }),
          catchError(err => this.handleError(err))
        );
      })
    );
  }

  // Récupérer un produit par son ID
  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.API_URL}/${id}`).pipe(
      retry(1),
      map(produit => {
        // Conversion des dates
        return this.parseDates([produit])[0];
      }),
      catchError(err => this.handleError(err))
    );
  }

  // Ajout du produit
  postProduit(produit: Partial<Produit>): Observable<Produit> {
    return this.http.post<Produit>(this.API_URL, produit).pipe(
      tap((res) => {
        // On déclenche le rafraîchissement des autres composants abonnés
        console.log(res)
        this.forceRefresh();
      }),
      catchError(err => this.handleError(err))
    );
  }

  // Update Produit
  updateProduit(id: string | number, produit: Partial<Produit>): Observable<Produit> {
    const url = `${this.API_URL}/${id}`;
    console.log("Tentative de PUT sur :", url)

    return this.http.put<Produit>(url, produit).pipe(
      tap( (res) => {
        console.log(res);
        this.forceRefresh();
      }),
      catchError( err => this.handleError(err))
    );
  }

  // DeleteProduitById
  deleteProduitById(id: string | number): Observable<void> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log(`Produit ${id} supprimé`);
        this.forceRefresh(); 
      }),
      catchError(err => this.handleError(err))
    );
  }

  private parseDates(produits: any[]): Produit[] {
    return produits.map(p => ({
      ...p,
      dateAjout: p.dateAjout ? new Date(p.dateAjout) : new Date(),
      dateModification: p.dateModification ? new Date(p.dateModification) : new Date()
    }));
  }

  forceRefresh() {
    console.log('[Debug] Forçage du rafraîchissement du stock...');
    this.refreshSignal$.next();
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Une erreur système est survenue';
    
    if (error.status === 0) {
      message = 'Impossible de contacter le serveur (Erreur Réseau)';
    } else if (error.status === 404) {
      message = `La collection "produits" est introuvable à l'adresse: ${this.API_URL}`;
    }

    console.error(`[Production Log] Code: ${error.status} | Message: ${error.message}`);
    return throwError(() => new Error(message));
  }
}