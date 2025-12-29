import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Produit } from '../../Models/produit';
import { ProduitsService } from '../produits-service';
import { NotificationService } from '../../Notification/notification-service';
import { Loading } from "../../loading/loading";
import { ConfirmModal } from '../../Notification/confirm-modal/confirm-modal';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [CommonModule, Loading, ConfirmModal],
  templateUrl: './detail-produit.html',
  styleUrl: './detail-produit.css',
})
export class DetailProduit implements OnInit {
  // --- Injections ---
  private readonly produitsServices = inject(ProduitsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notify = inject(NotificationService);

  // --- Propriétés ---
  produit: Produit | undefined;
  showDeleteModal: boolean = false;
  produitIdToDelete?: number;

  ngOnInit(): void {
    // On utilise paramMap pour être plus réactif aux changements d'URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduit(+id);
      }
    });
  }

  private loadProduit(id: number): void {
    this.produit = undefined; // Déclenche l'affichage du loader
    
    this.produitsServices.getProduitById(id).subscribe({
      next: (produit) => {
        // Le setTimeout(0) résout l'erreur NG0100 (ExpressionChangedAfterItHasBeenChecked)
        // en décalant la mise à jour à la prochaine micro-tâche.
        setTimeout(() => {
          this.produit = produit;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        this.notify.showError("Erreur lors du chargement du produit");
        console.error('Erreur:', error);
      }
    });
  }

  // --- Actions ---

  goToListProduits(): void {
    this.location.back();
  }

  goToUpdateProduit(produitId: number): void {
    this.router.navigate(['produits/updater-produit/', produitId]);
  }

  // --- Gestion de la suppression ---

  confirmDelete(id: number): void {
    this.produitIdToDelete = id;
    // Un léger délai garantit que la modale s'ouvre sans conflit de détection
    setTimeout(() => {
      this.showDeleteModal = true;
      this.cdr.detectChanges();
    }, 0);
  }

  onDeleteProduit(): void {
    if (this.produitIdToDelete) {
      this.produitsServices.deleteProduitById(this.produitIdToDelete).subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.cdr.detectChanges();
          this.notify.showSuccess('Produit supprimé avec succès !');
          this.goToListProduits();
        },
        error: (err) => {
          this.notify.showError("Impossible de supprimer le produit");
          this.showDeleteModal = false;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.produitIdToDelete = undefined;
    this.cdr.detectChanges();
  }
}