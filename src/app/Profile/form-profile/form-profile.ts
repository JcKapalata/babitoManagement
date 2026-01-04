import { Component, inject, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Models/agent';
import { finalize, first } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../profile-service';

@Component({
  selector: 'app-form-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, 
    MatDividerModule, MatProgressSpinnerModule
  ],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.css'
})
export class FormProfile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly profileService = inject(ProfileService);

  profileForm!: FormGroup;
  roles: string[] = ['admin', 'livreur', 'finance'];
  isUpdateMode = false;
  imagePreview: string | null = null;
  isLoading = false; // État de chargement pour le bouton
  
  hidePasswordContent = true;
  showPasswordFields = false; 
  
  readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  @Input() userId!: number; // Reçu du composant parent
  @Input() set userToUpdate(value: User | null) {
    if (value?.agent) {
      this.isUpdateMode = true;
      this.showPasswordFields = false;
      
      // CORRECTION ICI : On récupère l'id de l'agent
      this.userId = value.agent.id; 
      
      this.initForm();
      this.patchData(value);
      this.cdr.markForCheck();
      
      console.log('%c[DEBUG] ID récupéré:', 'color: blue; font-weight: bold;', this.userId);
    }
  }

  ngOnInit(): void {
    if (!this.profileForm) {
      this.showPasswordFields = true; 
      this.initForm();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      avatar: [''],
      password: [''],
      confirmPassword: ['']
    }, { validators: (c: AbstractControl) => this.passwordMatchValidator(c) });

    this.updatePasswordValidators();
  }

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;
    this.updatePasswordValidators();
  }

  private updatePasswordValidators(): void {
    const pwd = this.profileForm.get('password');
    const cpwd = this.profileForm.get('confirmPassword');

    if (this.showPasswordFields) {
      pwd?.setValidators([Validators.required, Validators.pattern(this.passwordPattern)]);
    } else {
      pwd?.clearValidators();
      cpwd?.clearValidators();
      pwd?.setValue('');
      cpwd?.setValue('');
    }
    pwd?.updateValueAndValidity();
    cpwd?.updateValueAndValidity();
  }

  private patchData(user: User): void {
    this.profileForm.patchValue({
      firstName: user.agent.firstName,
      lastName: user.agent.lastName,
      email: user.agent.email,
      role: user.agent.role,
      avatar: user.agent.avatar
    });
    this.imagePreview = user.agent.avatar || null;
  }

  passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!this.showPasswordFields) return null;
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  };

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) return 'Obligatoire';
    if (control?.hasError('email')) return 'Email invalide';
    if (control?.hasError('pattern')) return '8+ car., Maj, Min, Chiffre, Spécial';
    if (control?.hasError('passwordMismatch')) return 'Les mots de passe divergent';
    return '';
  }

  onFileSelected(event: Event): void {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.profileForm.get('avatar')?.setValue(this.imagePreview);
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    // 1. Garde-fous (Early exits)
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const cleanId = Number(this.userId);
    if (!cleanId || isNaN(cleanId)) {
      console.error('%c[ERROR] ID invalide', 'color: red; font-weight: bold;');
      return;
    }

    this.isLoading = true;
    
    // Destructuring des valeurs du formulaire pour plus de clarté
    const { firstName, lastName, email, role, avatar, password } = this.profileForm.value;

    // 2. Construction du Payload typé
    const updatedUserPayload = {
      id: cleanId,
      token: 'fake-jwt-token-002', 
      agent: {
        id: cleanId,
        firstName,
        lastName,
        email,
        role,
        avatar: avatar || 'profileAvatar/default-avatar.jpeg',
        ...(this.showPasswordFields && password ? { password } : {}) // Ajout conditionnel propre
      }
    };

    // 3. Traitement de la requête
    this.profileService.updateAgent(cleanId, updatedUserPayload)
      .pipe(
        first(),
        finalize(() => this.isLoading = false) // Gère le passage à false en cas de succès ET d'erreur
      )
      .subscribe({
        next: () => {
          console.log('%c[SUCCESS] Profil mis à jour', 'color: green; font-weight: bold;');
          
          // Synchronisation de l'état local (Source unique de vérité)
          this.profileService.updateLocalAgent(updatedUserPayload.agent);

          this.router.navigate(['profile/user-profile']);
        }
      });
  }

  cancel = () => this.router.navigate(['profile/user-profile']);
}