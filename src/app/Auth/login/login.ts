import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { Credentials } from '../../Models/credentials';
import { ProfileService } from '../../Profile/profile-service';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService)

  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false; // Pour désactiver le bouton pendant la requête

  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.passwordPattern)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // On transtype les valeurs du formulaire vers l'interface Credentials
      const credentials = this.loginForm.value as Credentials;

      this.authService.login(credentials.email, credentials.password).subscribe({
        next: (user) => {
          this.isLoading = false;
          if (user) {
            // On passe l'agent pour l'affichage ET le token pour le stockage
            this.profileService.setSession(user.agent, user.token);
            
            console.log('Utilisateur authentifié :', user.agent.firstName);
            // Redirection vers le tableau de bord
            this.router.navigate(['/tableau-de-bord']);
          } else {
            alert('Email ou mot de passe incorrect.');
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur technique :', err);
          alert('Impossible de contacter le serveur.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}