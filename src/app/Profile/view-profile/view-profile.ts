import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../profile-service';

@Component({
  selector: 'app-view-profile',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './view-profile.html',
  styleUrl: './view-profile.css',
})
export class ViewProfile {
  private profileService = inject(ProfileService);
  
  // On récupère l'agent sous forme d'observable
  agent$ = this.profileService.currentAgent$;
}