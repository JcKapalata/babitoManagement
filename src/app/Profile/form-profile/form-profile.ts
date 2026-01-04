import { Component, inject, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Models/agent';

@Component({
  selector: 'app-form-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.css'
})
export class FormProfile implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  profileForm!: FormGroup;
  roles = ['admin', 'livreur', 'finance'];
  isUpdateMode = false;
  imagePreview: string | null = null;

  @Input() set userToUpdate(value: User | null) {
    console.log('1. Réception Input:', value);

    // CONDITION CRUCIALE : On ne fait rien si la donnée est null ou incomplète
    if (!value || !value.agent) {
      console.warn('Données ignorées car null ou agent manquant');
      return; 
    }

    console.log('2. Données valides, remplissage...');
    this.isUpdateMode = true;
    
    // On s'assure que le formulaire existe
    if (!this.profileForm) {
      this.initForm();
    }
    
    this.patchData(value);
    
    // Forcer Angular à rafraîchir les inputs
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // Si le formulaire n'a pas été créé par l'Input, on le crée vide (Mode Création)
    if (!this.profileForm) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      avatar: [''], 
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    this.applyPasswordValidators();
  }

  private applyPasswordValidators(): void {
    const passwordControl = this.profileForm.get('password');
    if (!this.isUpdateMode) {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      passwordControl?.clearValidators(); // Optionnel en Update
    }
    passwordControl?.updateValueAndValidity();
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

  getErrorMessage(field: string): string {
    const control = this.profileForm?.get(field);
    if (!control || !control.errors || !control.touched) return '';
    if (control.hasError('required')) return 'Obligatoire';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('passwordMismatch')) return 'Mots de passe différents';
    return '';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (!password && !confirm) return null;
    if (password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.profileForm.patchValue({ avatar: this.imagePreview });
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Envoi au serveur:', this.profileForm.value);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}