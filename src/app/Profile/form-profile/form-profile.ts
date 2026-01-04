import { Component, inject, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Models/agent';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-form-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.css'
})
export class FormProfile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  profileForm!: FormGroup;
  roles: string[] = ['admin', 'livreur', 'finance'];
  isUpdateMode = false;
  imagePreview: string | null = null;
  
  // États de l'interface
  hidePasswordContent = true; // Masquer les caractères (●●●)
  showPasswordFields = false; // Afficher/Masquer les blocs d'input
  
  readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  @Input() set userToUpdate(value: User | null) {
    if (value?.agent) {
      this.isUpdateMode = true;
      this.showPasswordFields = false; // Masqué par défaut en édition
      this.initForm();
      this.patchData(value);
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (!this.profileForm) {
      this.showPasswordFields = true; // Affiché par défaut en création
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

  // Active ou désactive les validateurs selon l'affichage des champs
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
    if (control?.hasError('pattern')) return 'Sécurité insuffisante (8+ caractere, Maj, Min, Chiffre, Spécial)';
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
    if (this.profileForm.valid) {
      const payload = { ...this.profileForm.value };
      if (!this.showPasswordFields) delete payload.password;
      delete payload.confirmPassword;
      console.log('Payload Final:', payload);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  cancel = () => this.router.navigate(['/profile']);
}