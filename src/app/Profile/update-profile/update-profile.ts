import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormProfile } from "../form-profile/form-profile";
import { Agent } from '../../Models/agent'; 
import { ProfileService } from '../profile-service';
import { Loading } from "../../loading/loading";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormProfile, Loading],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfile implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef);
  
  // Changement : On utilise Agent car le GET renvoie les données de l'agent
  selectedAgent: Agent | null = null;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    // 1. Récupération sécurisée
    const userId = this.route.snapshot.paramMap.get('id');

    // Sécurité : on vérifie que l'ID n'est pas nul et ressemble à un UID Firebase (optionnel)
    if (userId && userId.length > 5) {
      const sub = this.profileService.getAgentById(userId).subscribe({
        next: (agentData) => {
          if (agentData) {
            // 2. Protection contre les données corrompues : 
            // On s'assure que l'ID de l'objet est bien celui de l'URL
            this.selectedAgent = { 
              ...agentData, 
              id: agentData.id || userId 
            }; 
            this.cdr.detectChanges(); 
          }
        },
        error: (err) => {
          // PRODUCTION : Log plus discret ou redirection
          console.error('Erreur profil récup:', err.status);
          if (err.status === 404) this.router.navigate(['/404']);
        }
      });
      this.subscription.add(sub);
    } else {
      // Si pas d'ID valide dans l'URL, on redirige vers le login ou accueil
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // 4. Robustesse : Nettoyage de la souscription pour éviter les fuites mémoire
    this.subscription.unsubscribe();
  }
}