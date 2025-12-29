import { produits } from './../produits';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitsService } from '../produits-service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Produit } from '../../Models/produit';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Loading } from "../../loading/loading";
import { NotificationService } from '../../Notification/notification-service';

@Component({
  selector: 'app-detail-produit',
  imports: [CommonModule, Loading],
  templateUrl: './detail-produit.html',
  styleUrl: './detail-produit.css',
})
export class DetailProduit implements OnInit {
  private produitsServices = inject(ProduitsService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private notify = inject(NotificationService)

  produit: Produit | undefined;

  ngOnInit(): void {
    const ProduitId = this.route.snapshot.paramMap.get('id');
    if (ProduitId) {
      this.produitsServices.getProduitById(+ProduitId).subscribe({
        next: (produit) => {
          this.produit = produit;
          
          // SOLUTION : Force le rendu immédiat du HTML
          this.cdr.detectChanges(); 
          
          console.log('Produit chargé et affichage forcé');
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
  }

  goToListProduits() {
    this.location.back()
  }

  goToUpdateProduit(produitId: number){
    this.router.navigate(['produits/updater-produit/', produitId])
  }

  onDeleteProduit(id: string | number, nomProduit: string): void {
    // 1. Confirmation de sécurité
    const confirmation = confirm(`Voulez-vous vraiment supprimer le produit "${nomProduit}" ?`);

    if (confirmation) {
      this.produitsServices.deleteProduitById(id).subscribe({
        next: () => {
          this.notify.showSuccess('Le produit a été supprimé avec succès.');
          this.router.navigate(['produits/produits-disponibles']);
        },
        error: (err) => {
          this.notify.showError('Erreur lors de la suppression : ' + err.message);
        }
      });
    }
  }
}
