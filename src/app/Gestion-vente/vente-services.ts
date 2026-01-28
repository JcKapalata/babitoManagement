import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, startWith, tap, throwError } from 'rxjs';
import { 
  Firestore, 
  collection,
  doc,
  DocumentSnapshot, 
  onSnapshot,
  DocumentData,
  orderBy,
  limit,
  query
} from '@angular/fire/firestore'; 

import { environment } from '../../environments/environment';
import { ApiResponse, OrderAdmin, OrderLogistics } from '../Models/order';

@Injectable({
  providedIn: 'root',
})
export class VenteServices {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private zone = inject(NgZone);
  
  private readonly API_URL = `${environment.apiUrl}/admin/ventes`;

  // Récupération des ventes en temps réel avec tri côté client
  getVentesRealtime(maxResults: number = 50): Observable<OrderAdmin[]> {
    return new Observable<OrderAdmin[]>((observer) => {
      const colRef = collection(this.firestore, 'orders');
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(maxResults));

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          this.zone.run(() => {
            const ventes = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data()['createdAt']?.toDate?.() || doc.data()['createdAt']
            } as OrderAdmin));
            observer.next(ventes);
          });
        }, 
        (error) => {
          this.zone.run(() => {
            console.error("❌ Erreur Firestore Permission/Index:", error.message);
            // On envoie un tableau vide au lieu de crash
            observer.next([]); 
          });
        }
      );
      return () => unsubscribe();
    });
  }

  /**
   * 2. LECTURE : Logistique typée (orderManagers)
   */
  getOrderLogisticsRealtime(orderId: string): Observable<OrderLogistics | null> {
    return new Observable((observer) => {
      // 'doc' est maintenant correctement importé
      const docRef = doc(this.firestore, 'orderManagers', orderId);

      // Typage du snapshot : DocumentSnapshot<DocumentData>
      const unsubscribe = onSnapshot(docRef, (snapshot: DocumentSnapshot<DocumentData>) => {
        this.zone.run(() => {
          if (snapshot.exists()) {
            observer.next(snapshot.data() as OrderLogistics);
          } else {
            observer.next(null);
          }
        });
      }, (error) => this.zone.run(() => observer.error(error)));

      return () => unsubscribe();
    });
  }

  /**
   * ACTION : Assigner plusieurs agents
   */
  assignMultipleAgents(orderId: string, agentIds: string[], internalNotes?: string): Observable<ApiResponse<OrderAdmin>> {
    console.log(`📡 [HTTP START] Assignation multiple pour OrderID: ${orderId}`, { agentIds, internalNotes });

    return this.http.put<ApiResponse<OrderAdmin>>(
      `${this.API_URL}/${orderId}/assign-multiple-agents`, 
      { agentIds, internalNotes }
    ).pipe(
      tap((response) => {
        // Log en cas de succès
        console.log(`✅ [HTTP SUCCESS] Assignation réussie pour ${orderId}`, response);
      }),
      catchError((error) => {
        // Log détaillé en cas d'erreur
        console.error(`🔥 [HTTP ERROR] Échec de l'assignation pour ${orderId}`);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Détails API:', error.error); // Contient souvent le message du backend

        // On renvoie l'erreur pour que le composant puisse l'afficher à l'utilisateur
        return throwError(() => error);
      })
    );
  }

  /**
   * LECTURE : Récupération des données logistiques via HTTP
   */
  getOrderLogistique(orderId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/${orderId}/logistique`)
      .pipe(
        tap(res => console.log('📦 Données logistiques récupérées', res)),
        catchError(err => {
          console.error('❌ Erreur logistique', err);
          return throwError(() => err);
        })
      );
  }

  /**
   * Retourne les ventes filtrées par statut en temps réel
   */
  getVentesByStatus(status: string): Observable<OrderAdmin[]> {
    return this.getVentesRealtime().pipe(
      map(ventes => ventes.filter(vente => vente.status === status)),
      startWith([] as OrderAdmin[])
    );
  }

  // ✅ Récupération typée : on attend une ApiResponse contenant un OrderAdmin
  getVenteById(id: string): Observable<ApiResponse<OrderAdmin>> {
    return this.http.get<ApiResponse<OrderAdmin>>(`${this.API_URL}/${id}`);
  }

  // ✅ Mise à jour typée
  updateStatus(orderId: string, status: string): Observable<ApiResponse<void>> {
    // Correction de l'URL pour correspondre à ton Backend Express
    return this.http.put<ApiResponse<void>>(
      `${this.API_URL}/${orderId}/status`, 
      { status }
    );
  }

  /**
   * Retourne un objet contenant les compteurs séparés pour Pending et Processing.
   * Optimisé pour la sécurité : les composants ne reçoivent que les chiffres.
   */
  getAlerteStatusCounts(): Observable<{ pending: number, processing: number }> {
    return this.getVentesRealtime().pipe(
      map(ventes => {
        return {
          pending: ventes.filter(v => v.status === 'pending').length,
          processing: ventes.filter(v => v.status === 'processing').length
        };
      }),
      startWith({ pending: 0, processing: 0 })
    );
  }
}