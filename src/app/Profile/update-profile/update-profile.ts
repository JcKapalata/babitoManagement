import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormProfile } from "../form-profile/form-profile";
import { User } from '../../Models/agent';
import { ProfileService } from '../profile-service';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [FormProfile, Loading],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef); // On injecte ici
  
  selectedUser: User | null = null;

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    const userId = Number(rawId);

    if (userId) {
      this.profileService.getUserById(userId).subscribe({
        next: (user) => {
          if (user) {
            console.log('Données reçues du service:', user);
            // 1. On assigne la donnée
            this.selectedUser = { ...user }; 
            
            // 2. On force Angular à détecter que selectedUser n'est plus null
            // Cela va déclencher le @if dans le HTML et envoyer l'Input à l'enfant
            this.cdr.detectChanges(); 
          }
        },
        error: (err) => console.error('Erreur lors de la récupération:', err)
      });
    }
  }
}