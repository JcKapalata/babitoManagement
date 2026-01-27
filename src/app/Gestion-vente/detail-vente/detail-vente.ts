import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenteServices } from '../vente-services';
import { OrderAdmin } from '../../Models/order';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ControleVente } from "../controle-vente/controle-vente";
import { OrderStatusPipe } from "../order-status-pipe";
import { ConfirmModal } from "../../Notification/confirm-modal/confirm-modal";

@Component({
  selector: 'app-detail-vente',
  standalone: true, // N'oublie pas standalone si tu ne l'avais pas mis
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ControleVente,
    OrderStatusPipe,
    ConfirmModal
],
  templateUrl: './detail-vente.html',
  styleUrl: './detail-vente.css',
})
export class DetailVente implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private venteService = inject(VenteServices);
  private cdr = inject(ChangeDetectorRef);

  vente: OrderAdmin | null = null;
  loading = true; 
  showConfig = false;

  // Variables pour la confirmation de changement de statut
  showConfirm = false;
  pendingStatus: string | null = null;
  confirmMessage = "";
  confirmBtnLabel = "";
  confirmBtnVariant: 'confirm' | 'danger' = 'confirm';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchVente(id);
    } else {
      this.retour();
    }
  }

  fetchVente(id: string) {
    this.loading = true;
    this.venteService.getVenteById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.vente = response.data;
          this.loading = false;
          this.cdr.detectChanges(); // ✅ Force Angular à rafraîchir la vue avec les données
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
        this.cdr.detectChanges(); // ✅ Rafraîchit aussi pour enlever le spinner en cas d'erreur
      }
    });
  }

  changerStatut(statut: string) {
    if (!this.vente) return;
    
    this.venteService.updateStatus(this.vente.id, statut).subscribe({
      next: (res) => {
        if (res.success) {
          // Redirection dynamique selon le statut
          this.redirigerSelonStatut(statut);
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.cdr.detectChanges();
      }
    });
  }

  
  //Gère la redirection optimisée selon le nouveau statut
  private redirigerSelonStatut(statut: string) {
    let routeDest = 'ventes/vente-encours'; // Par défaut

    switch (statut) {
      case 'paid':
        routeDest = 'ventes/ventes-livres'; // Si payé, on va voir les livraisons/payées
        break;
      case 'cancelled':
        routeDest = 'ventes/ventes-annules'; // Si annulé, vers les archives/annulations
        break;
      case 'processing':
        routeDest = 'ventes/ventes-non-livres';
        break;
      // Ajoute d'autres cas selon tes routes réelles
    }

    this.router.navigate([routeDest]);
  }

  toggleConfig() {
    this.showConfig = !this.showConfig;
    this.cdr.detectChanges();
  }

  retour() {
    this.location.back();
  }

  // La fonction pour ouvrir la boîte de confirmation
  ouvrirConfirmation(statut: string) {
    this.pendingStatus = statut;
    this.showConfirm = true;

    if (statut === 'paid') {
      this.confirmMessage = "Voulez-vous vraiment confirmer le paiement de cette commande ?";
      this.confirmBtnLabel = "Confirmer le paiement";
      this.confirmBtnVariant = 'confirm'; // Utilisera la classe .btn-confirm
    } else {
      this.confirmMessage = "Voulez-vous vraiment annuler cette commande ?";
      this.confirmBtnLabel = "Annuler la commande";
      this.confirmBtnVariant = 'danger'; // Utilisera la classe .btn-danger
    }
  }

  // La fonction qui sera appelée après confirmation
  confirmerChangement() {
    if (this.pendingStatus) {
      this.changerStatut(this.pendingStatus);
    }
    this.showConfirm = false;
  }

  annulerConfirmation() {
    this.showConfirm = false;
    this.pendingStatus = null;
  }
}