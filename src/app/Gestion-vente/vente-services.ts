import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, startWith, switchMap, tap, throwError } from 'rxjs';
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
import { Auth, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class VenteServices {
  private http = inject(HttpClient);
  private zone = inject(NgZone);
  
  private readonly API_URL = `${environment.apiUrl}/admin/ventes`;
  private firestore = inject(Firestore);
  private auth = inject(Auth);


  /**
   * RÉCUPÉRATION RÉACTIVE ET SÉCURISÉE
   * On attend que l'utilisateur soit authentifié avant de lancer le listener.
   */
  getVentesRealtime(maxResults: number = 50): Observable<OrderAdmin[]> {
    console.log('📡 [Firestore] Tentative de connexion au flux "orders"...');

    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          console.warn('⚠️ [Firestore] Accès refusé : Aucun utilisateur Firebase détecté.');
          return of([]); // On renvoie un tableau vide plutôt que de crash
        }

        console.log(`✅ [Firestore] Utilisateur authentifié (UID: ${user.uid}), lancement du listener.`);

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
                
                console.log(`📊 [Firestore] ${ventes.length} ventes reçues en temps réel.`);
                observer.next(ventes);
              });
            }, 
            (error) => {
              this.zone.run(() => {
                // 🕵️ LE LOG DE DÉBOGAGE ULTIME
                console.error("❌ [Firestore ERROR] Problème de droits ou d'index !");
                console.error("Message:", error.message);
                console.error("Code:", error.code);
                observer.next([]); 
              });
            }
          );
          return () => {
            console.log('🔌 [Firestore] Fermeture du listener "orders".');
            unsubscribe();
          };
        });
      })
    );
  }
  
  
  /**   
   * RÉCUPÉRATION RÉACTIVE DES DONNÉES LOGISTIQUES D'UNE COMMANDE
   */
  getOrderLogisticsRealtime(orderId: string): Observable<OrderLogistics | null> {
    return new Observable((observer) => {
      try {
        // ✅ Utilise this.firestore
        const docRef = doc(this.firestore, 'orderManagers', orderId);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          this.zone.run(() => {
            if (snapshot.exists()) {
              observer.next(snapshot.data() as OrderLogistics);
            } else {
              observer.next(null);
            }
          });
        }, (error) => this.zone.run(() => observer.error(error)));

        return () => unsubscribe();
      } catch (error) {
        console.error('❌ Error in getOrderLogisticsRealtime:', error);
        observer.next(null);
        return () => {};
      }
    });
  }

  /**
   * ACTION : Assigner plusieurs agents
   * Utilise le typage strict <ApiResponse<OrderAdmin>>
   */
  assignMultipleAgents(orderId: string, agentIds: string[], internalNotes?: string): Observable<ApiResponse<OrderAdmin>> {
    const payload = { agentIds, internalNotes };
    
    // Log de début avec timestamp pour le traçage
    console.log(`%c📡 [HTTP CALL] ${new Date().toLocaleTimeString()} - Assignation Order: ${orderId}`, 'color: #3498db; font-weight: bold;');

    return this.http.put<ApiResponse<OrderAdmin>>(
      `${this.API_URL}/${orderId}/assign-multiple-agents`, 
      payload
    ).pipe(
      // 1. Succès : On logge la réponse propre
      tap((response) => {
        console.log(`%c✅ [SUCCESS] Commande ${orderId} mise à jour`, 'color: #27ae60; font-weight: bold;', response);
      }),
      
      // 2. Erreur : On utilise une méthode centralisée pour ne rien rater
      catchError((error: HttpErrorResponse) => {
        this.logErrorDetails(error, 'AssignMultipleAgents', orderId);
        
        // On renvoie un message propre au composant
        const userFriendlyMessage = error.error?.message || "Impossible d'assigner les agents.";
        return throwError(() => new Error(userFriendlyMessage));
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

  /**
   * Helper privé pour logger les détails sans utiliser de propriétés obsolètes
   */
  private logErrorDetails(error: HttpErrorResponse, context: string, id?: string): void {
    // Utilisation de console.group pour un affichage propre dans la console
    console.group(`🔥 [ERROR] ${context} - ID: ${id || 'N/A'}`);
    
    console.error('Code Numérique:', error.status); // Ex: 404, 500, 401
    console.error('URL appelée:', error.url);
    
    // Au lieu de statusText, on peut afficher le message d'erreur brut du navigateur
    // ou le message personnalisé envoyé par ton backend Node.js
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client (réseau)
      console.error('Type: Erreur Client/Réseau');
      console.error('Détails:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error('Type: Erreur Serveur');
      console.error('Réponse du Backend:', error.error);
    }
    
    // Conseils de débuggage selon le code reçu
    this.printDebugTip(error.status);

    console.groupEnd();
  }

  /**
   * Affiche des conseils selon le code HTTP
   */
  private printDebugTip(status: number): void {
    switch (status) {
      case 0:
        console.warn('💡 Conseil: Le serveur est éteint ou l\'URL est bloquée par CORS.');
        break;
      case 401:
        console.warn('💡 Conseil: Token absent ou expiré. Vérifie localStorage.');
        break;
      case 403:
        console.warn('💡 Conseil: Token valide mais droits insuffisants (Rôle Agent vs Admin).');
        break;
      case 404:
        console.warn('💡 Conseil: La route n\'existe pas sur le serveur. Vérifie l\'URL.');
        break;
    }
  }
}