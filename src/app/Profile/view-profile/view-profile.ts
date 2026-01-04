import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../profile-service';
import { Router } from '@angular/router';

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
  agent$ = this.profileService.currentAgent$;

  //goToUpdate
  goToUpdateProfile(userId: number){
    this.router.navigate(['profile/update-profile', userId])
  }
}