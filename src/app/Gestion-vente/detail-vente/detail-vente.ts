import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenteServices } from '../vente-services';
import { OrderAdmin } from '../../Models/order';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-detail-vente',
  standalone: true, // N'oublie pas standalone si tu ne l'avais pas mis
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinnerModule
  ],
  templateUrl: './detail-vente.html',
  styleUrl: './detail-vente.css',
})
export class DetailVente implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private venteService = inject(VenteServices);

  vente: OrderAdmin | null = null;
  loading = true; // Pour gérer l'état d'affichage

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.fetchVente(id);
    } else {
      console.error('ID introuvable dans l\'URL');
      this.retour();
    }
  }

  fetchVente(id: string) {
    this.loading = true;
    // ✅ On utilise l'API REST typée maintenant
    this.venteService.getVenteById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.vente = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération:', err);
        this.loading = false;
      }
    });
  }

  changerStatut(statut: string) {
    if (!this.vente) return;
    
    this.venteService.updateStatus(this.vente.id, statut).subscribe({
      next: (res) => {
        if (res.success) {
          console.log('Statut mis à jour avec succès');
          this.retour(); 
        }
      },
      error: (err) => console.error('Erreur lors de la mise à jour:', err)
    });
  }

  retour() {
    this.router.navigate(['ventes/vente-encours']);
  }
}