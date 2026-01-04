import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormProfile } from "../form-profile/form-profile";
import { User } from '../../Models/agent';
import { ProfileService } from '../profile-service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [FormProfile],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);

  selectedUser: User | null = null;

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    console.log('ID brut dans l\'URL :', rawId);

    const userId = Number(rawId);
    console.log('ID converti en nombre :', userId);

    if (userId) {
      this.profileService.getUserById(userId).subscribe({
        next: (user) => {
          console.log('Réponse reçue du service :', user);
          if (user) {
            this.selectedUser = user;
            console.table(this.selectedUser);
          } else {
            console.warn('Utilisateur non trouvé pour cet ID');
          }
        },
        error: (err) => console.error('Erreur Observable :', err)
      });
    } else {
      console.error('Erreur : userId est invalide ou absent de l\'URL');
    }
  }
}