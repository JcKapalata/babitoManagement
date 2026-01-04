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
  goToUpdateProfile(userId: number | undefined) {
  if (!userId) {
    console.error("Impossible de modifier : l'ID de l'agent est introuvable dans l'objet", this.agent$);
    return;
  }
  this.router.navigate(['profile/update-profile', userId]);
}
}