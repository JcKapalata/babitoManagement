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
    // 1. Validation de sécurité
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const val = this.profileForm.value;

    if (this.isUpdateMode) {
      /** * --- MODE ÉDITION (PUT) ---
       */
      const cleanId = Number(this.userId);
      const updatedUserPayload = {
        id: cleanId,
        token: 'fake-jwt-token-002', 
        agent: {
          id: cleanId,
          firstName: val.firstName,
          lastName: val.lastName,
          email: val.email,
          role: val.role,
          avatar: val.avatar || 'profileAvatar/default-avatar.jpeg',
          ...(this.showPasswordFields && val.password ? { password: val.password } : {})
        }
      };

      this.profileService.updateAgent(cleanId, updatedUserPayload)
        .pipe(
          first(),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            console.log('%c[UPDATE SUCCESS]', 'color: green; font-weight: bold;');
            this.profileService.updateLocalAgent(updatedUserPayload.agent);
            this.router.navigate(['profile/user-profile']);
          }
        });

    } else {
      /** * --- MODE CRÉATION (POST) ---
       */
      const newUserPayload = {
        // On ne met pas d'ID ici, In-Memory le générera
        token: 'fake-jwt-token-' + Math.random().toString(36).substring(7),
        agent: {
          firstName: val.firstName,
          lastName: val.lastName,
          email: val.email,
          role: val.role,
          avatar: val.avatar || 'profileAvatar/default-avatar.jpeg',
          password: val.password 
        }
      };

      this.profileService.createAgent(newUserPayload)
        .pipe(
          first(),
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response) => {
            console.log('%c[CREATE SUCCESS]', 'color: #2ecc71; font-weight: bold;', response);
            
            // CRUCIAL : On fusionne l'ID généré par In-Memory dans l'objet agent
            if (response && response.agent) {
              const agentWithId = {
                ...response.agent,
                id: response.id // L'ID généré par le simulateur est ici
              };
              
              // On informe le reste de l'appli que cet agent est l'agent courant
              this.profileService.updateLocalAgent(agentWithId);
            }
            
            this.router.navigate(['profile/user-profile']);
          }
        });
    }
  }

  cancel = () => this.router.navigate(['profile/user-profile']);
}