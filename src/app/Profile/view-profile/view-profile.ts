import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../profile-service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './view-profile.html',
  styleUrl: './view-profile.css',
})
export class ViewProfile {
  private profileService = inject(ProfileService);
  private router = inject(Router)
  
  // On récupère l'agent sous forme d'observable
  agent$ = this.profileService.currentAgent$.pipe(
    tap(agent => {
      console.log('%c[VIEW PROFILE] Données de l\'agent reçues:', 'color: #007bff; font-weight: bold;', agent);
    })
  );

  //goToUpdate
  goToUpdateProfile(userId: string | undefined) {
    // 1. Sécurité : Vérification stricte de l'ID
    if (!userId || userId.trim() === '') {
      console.error("[SECURITY ALERT] Tentative de navigation sans ID valide");
      // Optionnel : afficher un toast/alerte à l'utilisateur
      return;
    }

    // 2. Navigation robuste
    // On utilise un chemin relatif ou absolu propre
    this.router.navigate(['profile/update-profile', userId]).then(nav => {
      if (!nav) console.error("Échec de la navigation vers le profil");
    });
  }
}