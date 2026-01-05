import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { Credentials } from '../../Models/credentials';
import { ProfileService } from '../../Profile/profile-service';
import { firstValueFrom } from 'rxjs';
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
  private route = inject(ActivatedRoute);
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

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const credentials = this.loginForm.value as Credentials;

    // 1. On récupère la destination AVANT ou PENDANT le login de manière asynchrone
    // On utilise l'Observable pour être sûr de ne pas rater le paramètre
    const params = await firstValueFrom(this.route.queryParams);
    const returnUrl = params['returnUrl'];

    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (user) => {
        if (user) {
          // 2. Initialisation de la session
          this.profileService.setSession(user.agent, user.token);

          // 3. Calcul de la cible
          const finalTarget = returnUrl ? decodeURIComponent(returnUrl) : '/tableau-de-bord';
          
          console.log(`[Login] Redirection vers: ${finalTarget}`);

          // 4. Navigation avec gestion du rafraîchissement
          this.router.navigateByUrl(finalTarget).then(() => {
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
          alert('Identifiants incorrects');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur Login:', err);
      }
    });
  }
}