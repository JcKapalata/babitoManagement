import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, retry, switchMap, throwError, tap } from 'rxjs';
import { Produit } from '../Models/produit';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../Models/order';

export interface PaginatedProduits {
  items: Produit[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  // Changement de l'URL pour correspondre à votre alias backend /produits
  private readonly API_URL = `${environment.apiUrl}/manager/produits`; 
  private readonly http = inject(HttpClient);
  
  // Signal de rafraîchissement - INITIALISER AVEC UNE VALEUR POUR DÉCLENCHER LA PREMIÈRE REQUÊTE
  private refreshSignal$ = new BehaviorSubject<void>(undefined);

  /**
   * Récupère la liste des produits
   * Adapté pour la structure { success: boolean, count: number, data: [] }
   */
  getProduits(page: number = 0, size: number = 20): Observable<PaginatedProduits> {
    return this.refreshSignal$.pipe(
      tap(() => console.log(`[🚀 HTTP GET] Chargement des produits... URL: ${this.API_URL}`)),
      switchMap(() => {
        console.log('[ProduitsService] Appel API à:', this.API_URL);
        return this.http.get<ApiResponse<Produit[]>>(this.API_URL).pipe(
          retry(1),
          map((res: ApiResponse<Produit[]>) => {
            console.log('[ProduitsService] Réponse reçue:', res);
            // Le backend Express renvoie { success: true, count: X, data: [...] }
            const rawItems = res.data || [];
            console.log(`[📦 Backend Response] ${rawItems.length} produits reçus.`);

            const formattedItems = this.parseDates(rawItems);

            // Pagination manuelle côté front pour le manager
            const start = page * size;
            const end = start + size;
            const paginatedItems = formattedItems.slice(start, end);

            console.log(`[ProduitsService] Total items: ${formattedItems.length}, Paginated: ${paginatedItems.length}`);

            return {
              items: paginatedItems,
              total: formattedItems.length
            };
          }),
          catchError(err => this.handleError(err, 'getProduits'))
        );
      })
    );
  }

  getProduitById(id: string ): Observable<Produit> {
    console.log(`[🔍 HTTP GET] Recherche produit ID: ${id}`);
    return this.http.get<ApiResponse<Produit>>(`${this.API_URL}/${id}`).pipe(
      map((res: ApiResponse<Produit>) => {
        // res est { success: true, data: { ... } }
        const p = res.data;
        return this.parseDates([p])[0];
      }),
      catchError(err => this.handleError(err, 'getProduitById'))
    );
  }

  postProduit(produit: Partial<Produit>): Observable<Produit> {
    console.log('[📤 HTTP POST] Création nouveau produit:', produit);
    return this.http.post<any>(this.API_URL, produit).pipe(
      tap((res) => {
        console.log('[✅ Success] Produit créé:', res);
        this.forceRefresh();
      }),
      map((res: ApiResponse<Produit>) => res.data),
      catchError(err => this.handleError(err, 'postProduit'))
    );
  }

  updateProduit(id: string, produit: Partial<Produit>): Observable<Produit> {
    const url = `${this.API_URL}/${id}`;
    console.log(`[🔄 HTTP PUT] Mise à jour produit ${id}:`, produit);

    return this.http.put<ApiResponse<Produit>>(url, produit).pipe(
      tap((res) => {
        console.log('[✅ Success] Produit mis à jour:', res);
        this.forceRefresh();
      }),
      map((res: ApiResponse<Produit>) => res.data),
      catchError(err => this.handleError(err, 'updateProduit'))
    );
  }

  deleteProduitById(id: string): Observable<void> {
    const url = `${this.API_URL}/${id}`;
    console.log(`[🗑️ HTTP DELETE] Suppression produit ${id}`);
    
    return this.http.delete<any>(url).pipe(
      tap(() => {
        console.log(`[✅ Success] Produit ${id} supprimé`);
        this.forceRefresh(); 
      }),
      map(() => void 0),
      catchError(err => this.handleError(err, 'deleteProduitById'))
    );
  }

  /**
   * Normalise les données avec un typage d'entrée flexible (Record)
   */
  private parseDates(produits: Record<string, any>[]): Produit[] {
    return produits.map(p => {
      const pMapped: Produit = {
        ...p as Produit, // On cast l'objet de base
        id: String(p['id']), // On s'assure que l'ID est une string
        tailles: p['tailles'] || p['taille'] || {},
        createdAt: p['createdAt'] ? new Date(p['createdAt']) : new Date(),
        updatedAt: p['updatedAt'] ? new Date(p['updatedAt']) : new Date()
      };
      return pMapped;
    });
  }

  forceRefresh() {
    console.log('[🔔 Signal] Forçage du rafraîchissement des données...');
    this.refreshSignal$.next();
  }

  private handleError(error: HttpErrorResponse, methodName: string) {
    let message = 'Une erreur système est survenue';
    
    if (error.status === 0) {
      message = 'Impossible de contacter le serveur (Vérifiez votre connexion ou CORS)';
    } else {
      // On essaie de récupérer le message d'erreur envoyé par votre API Express
      message = error.error?.message || `Erreur lors de l'exécution de ${methodName}`;
    }

    console.error(`[❌ ERROR ${methodName}] Code: ${error.status} | Msg: ${message}`);
    return throwError(() => new Error(message));
  }
}