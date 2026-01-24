import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {  Router } from '@angular/router';
import { FormProfile } from "../form-profile/form-profile";
import { Agent } from '../../Models/agent'; 
import { ProfileService } from '../profile-service';
import { Loading } from "../../loading/loading";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormProfile, Loading],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfile implements OnInit {
  private readonly router = inject(Router);
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef);
  
  selectedAgent: Agent | null = null;

  ngOnInit() {
    // On lit la valeur du Signal directement
    const currentAgent = this.profileService.currentUser();

    if (currentAgent) {
      this.selectedAgent = currentAgent;
      this.cdr.detectChanges();
    } else {
      console.warn("Données non trouvées en mémoire, redirection...");
      this.router.navigate(['/manager/profile']); 
    }
  }
}