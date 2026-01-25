import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Firestore, 
  collection, 
  onSnapshot,
  DocumentData
} from '@angular/fire/firestore'; 

import { environment } from '../../environments/environment';
import { ApiResponse, OrderAdmin } from '../Models/order';

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