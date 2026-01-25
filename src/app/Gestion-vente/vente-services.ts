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
import { OrderAdmin } from '../Models/order';

@Injectable({
  providedIn: 'root',
})
export class VenteServices {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private zone = inject(NgZone);
  
  private readonly API_URL = `${environment.apiUrl}/admin/ventes`;

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

  updateStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${orderId}/status`, { status });
  }
}