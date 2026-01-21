import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { ProfileService } from '../../Profile/profile-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
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
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false; 
  errorMessage: string | null = null; 

  // Pattern : 8 carac min, 1 Maj, 1 min, 1 chiffre, 1 spécial
  readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8),
          Validators.pattern(this.passwordPattern) // Ajout de la validation de complexité
        ]
      ]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null; 
    
    const { email, password } = this.loginForm.value;

    try {
      const params = await firstValueFrom(this.route.queryParams);
      const returnUrl = params['returnUrl'];

      this.authService.login(email, password).subscribe({
        next: (user) => {
          this.profileService.setSession(user.agent, user.token);
          const finalTarget = returnUrl ? decodeURIComponent(returnUrl) : '/tableau-de-bord';
          
          this.router.navigateByUrl(finalTarget).then(() => {
            this.isLoading = false;
          });
        },
        error: (err: Error) => {
          this.isLoading = false;
          this.errorMessage = err.message;
          this.cdr.detectChanges(); 
          console.error('[Login Component]:', err.message);
        }
      });
    } catch (e) {
      this.isLoading = false;
    }
  }
}