import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, retry, switchMap, throwError, tap } from 'rxjs';
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
<<<<<<< HEAD
        console.log('[ProduitsService] Appel API à:', this.API_URL);
        // NOTE: Si vous utilisez In-Memory, les paramètres 'page' et 'size' 
        // bloquent souvent la réponse. On les enlève pour le test.
        return this.http.get<any>(this.API_URL).pipe(
          retry(1),
          map(res => {
            console.log('[ProduitsService] Réponse reçue:', res);
            // Extraction des données (gestion tableau direct ou objet)
            let items: Produit[] = Array.isArray(res) ? res : (res.data || res.items || []);
=======
        return this.http.get<any>(this.API_URL).pipe(
          retry(1),
          map(res => {
            // Le backend Express renvoie { success: true, count: X, data: [...] }
            const rawItems = res.data || [];
            console.log(`[📦 Backend Response] ${rawItems.length} produits reçus.`);
>>>>>>> 41b281062c96e865bb5991f52c57712ee5d1a8be

            const formattedItems = this.parseDates(rawItems);

            // Pagination manuelle côté front pour le manager
            const start = page * size;
            const end = start + size;
<<<<<<< HEAD
            const paginatedItems = items.slice(start, end);

            console.log(`[ProduitsService] Total items: ${items.length}, Paginated: ${paginatedItems.length}`);
=======
            const paginatedItems = formattedItems.slice(start, end);
>>>>>>> 41b281062c96e865bb5991f52c57712ee5d1a8be

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

  getProduitById(id: string | number): Observable<Produit> {
    console.log(`[🔍 HTTP GET] Recherche produit ID: ${id}`);
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => {
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
      map(res => res.data),
      catchError(err => this.handleError(err, 'postProduit'))
    );
  }

  updateProduit(id: string | number, produit: Partial<Produit>): Observable<Produit> {
    const url = `${this.API_URL}/${id}`;
    console.log(`[🔄 HTTP PUT] Mise à jour produit ${id}:`, produit);

    return this.http.put<any>(url, produit).pipe(
      tap((res) => {
        console.log('[✅ Success] Produit mis à jour:', res);
        this.forceRefresh();
      }),
      map(res => res.data),
      catchError(err => this.handleError(err, 'updateProduit'))
    );
  }

  deleteProduitById(id: string | number): Observable<void> {
    const url = `${this.API_URL}/${id}`;
    console.log(`[🗑️ HTTP DELETE] Suppression produit ${id}`);
    
    return this.http.delete<any>(url).pipe(
      tap(() => {
        console.log(`[✅ Success] Produit ${id} supprimé`);
        this.forceRefresh(); 
      }),
      catchError(err => this.handleError(err, 'deleteProduitById'))
    );
  }

  /**
   * Normalise les données reçues du Backend
   */
  private parseDates(produits: any[]): Produit[] {
    return produits.map(p => {
      // Gestion de l'ID : Firestore ID (string) -> Produit Admin (number ou string)
      // On s'assure que la clé 'tailles' (pluriel) existe pour le front admin
      const pMapped = {
        ...p,
        id: p.id, // On garde l'ID tel quel (string Firestore)
        tailles: p.tailles || p.taille || {}, // Normalisation singulier/pluriel
        dateAjout: p.createdAt ? new Date(p.createdAt) : new Date(),
        dateModification: p.updatedAt ? new Date(p.updatedAt) : new Date()
      };
      return pMapped as Produit;
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