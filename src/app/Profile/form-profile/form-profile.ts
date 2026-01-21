import { Component, inject, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Agent } from '../../Models/agent';
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
  isLoading = false;
  hidePasswordContent = true;
  showPasswordFields = false; 
  
  readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  @Input() userId!: string;

  @Input() set userToUpdate(value: any | null) {
    const agent: Agent = value?.agent ? value.agent : value;
    if (agent && agent.id) {
      this.isUpdateMode = true;
      this.showPasswordFields = false;
      this.userId = agent.id; 
      this.initForm();
      this.patchData(agent);
      this.cdr.markForCheck();
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

  // --- MÉTHODES DE GESTION DU FORMULAIRE ---

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;
    this.updatePasswordValidators();
  }

  private updatePasswordValidators(): void {
    const pwd = this.profileForm.get('password');
    const cpwd = this.profileForm.get('confirmPassword');

    if (this.showPasswordFields) {
      pwd?.setValidators([Validators.required, Validators.pattern(this.passwordPattern)]);
      cpwd?.setValidators([Validators.required]);
    } else {
      pwd?.clearValidators();
      cpwd?.clearValidators();
      pwd?.setValue('');
      cpwd?.setValue('');
    }
    pwd?.updateValueAndValidity();
    cpwd?.updateValueAndValidity();
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.showPasswordFields) return null;
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    
    if (password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) return 'Obligatoire';
    if (control?.hasError('email')) return 'Email invalide';
    if (control?.hasError('pattern')) return '8+ car., Maj, Min, Chiffre, Spécial';
    if (control?.hasError('passwordMismatch')) return 'Les mots de passe divergent';
    return '';
  }

  private patchData(agent: Agent): void {
    this.profileForm.patchValue({
      firstName: agent.firstName,
      lastName: agent.lastName,
      email: agent.email,
      role: agent.role,
      avatar: agent.avatar
    });
    this.imagePreview = agent.avatar || null;
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

  // --- ACTIONS ---

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const val = this.profileForm.value;

    if (this.isUpdateMode) {
      const updatedAgentPayload = {
        firstName: val.firstName,
        lastName: val.lastName,
        role: val.role,
        avatar: val.avatar || 'profileAvatar/default-avatar.jpeg',
        ...(this.showPasswordFields && val.password ? { password: val.password } : {})
      };

      this.profileService.updateAgent(this.userId, updatedAgentPayload)
        .pipe(first(), finalize(() => this.isLoading = false))
        .subscribe({
          next: () => this.router.navigate(['profile/user-profile']),
          error: (err) => alert(err.message)
        });
    } else {
      const newUserPayload = {
        email: val.email,
        password: val.password,
        firstName: val.firstName,
        lastName: val.lastName,
        role: val.role,
        avatar: val.avatar || 'profileAvatar/default-avatar.jpeg'
      };

      this.profileService.createAgent(newUserPayload)
        .pipe(first(), finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            alert(`L'agent ${val.firstName} a été créé.`);
            this.router.navigate(['profile/user-profile']);
          },
          error: (err) => alert(err.message)
        });
    }
  }

  cancel = () => this.router.navigate(['profile/user-profile']);
}