// update-profile.ts
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
    const userId = Number(rawId);

    if (userId) {
      this.profileService.getUserById(userId).subscribe({
        next: (user) => {
          if (user) {
            // CRUCIAL : Créer une nouvelle référence pour forcer l'Input de l'enfant
            this.selectedUser = { ...user }; 
          }
        }
      });
    }
  }
}