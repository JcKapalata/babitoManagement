import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { 
  Firestore, 
  collection,
  doc,
  DocumentSnapshot, 
  onSnapshot,
  DocumentData
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
  getVentesRealtime(): Observable<OrderAdmin[]> {
    return new Observable<OrderAdmin[]>((observer) => {
      const colRef = collection(this.firestore, 'orders');

      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        this.zone.run(() => {
          const ventes = snapshot.docs.map(doc => {
            const data = doc.data() as any;
            return {
              ...data,
              id: doc.id,
              // Sécurité : Conversion des dates au cas où Firebase envoie un Timestamp
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
            } as OrderAdmin;
          });

          // ✅ Tri manuel côté client pour avoir les plus récents en haut
          ventes.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

          observer.next(ventes);
        });
      }, (error) => {
        this.zone.run(() => observer.error(error));
      });

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
   * 3. ACTION : Assigner un agent (Typage de la réponse API)
   */
  assignAgent(orderId: string, agentId: string, internalNotes?: string): Observable<ApiResponse<OrderAdmin>> {
    return this.http.put<ApiResponse<OrderAdmin>>(
      `${this.API_URL}/${orderId}/assign-agent`, 
      { agentId, internalNotes }
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
}