import { Component, inject, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { User, Agent } from '../../Models/agent';
import { ProfileService } from '../profile-service';

@Component({
  selector: 'app-form-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSelectModule
  ],
  templateUrl: './form-profile.html',
  styleUrl: './form-profile.css',
})
export class FormProfile implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef); // Injection du CDR

  profileForm!: FormGroup;
  roles = ['admin', 'livreur', 'finance'];
  isUpdateMode = false;
  imagePreview: string | null = null;

  private _userToUpdate: User | null = null;

  @Input() set userToUpdate(value: User | null) {
    this._userToUpdate = value;
    if (value && value.agent) {
      this.isUpdateMode = true;
      this.refreshForm(value);
    }
  }

  get userToUpdate(): User | null {
    return this._userToUpdate;
  }

  ngOnInit() {
    if (!this.profileForm) {
      this.initForm();
    }
  }

  private initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      avatar: [''], 
      password: ['', this.isUpdateMode ? [] : [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', this.isUpdateMode ? [] : [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  private refreshForm(user: User) {
    // 1. Recréer le formulaire pour les validateurs
    this.initForm(); 

    // 2. Injecter les données
    this.profileForm.patchValue({
      firstName: user.agent.firstName,
      lastName: user.agent.lastName,
      email: user.agent.email,
      role: user.agent.role,
      avatar: user.agent.avatar
    });

    this.imagePreview = user.agent.avatar || null;

    // 3. FORCER LA DÉTECTION DE CHANGEMENT
    // Indispensable si le parent change la donnée après le cycle initial
    this.cdr.detectChanges(); 
    
    console.log('CDR : Détection forcée pour', user.agent.firstName);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.profileForm.patchValue({ avatar: this.imagePreview });
        this.cdr.detectChanges(); // Forcer l'affichage de la nouvelle preview
      };
      reader.readAsDataURL(file);
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if ((password || confirm) && password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control?.hasError('required')) return 'Champ obligatoire';
    if (control?.hasError('email')) return 'Email invalide';
    if (control?.hasError('passwordMismatch')) return 'Mots de passe différents';
    return '';
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const result = { ...this.userToUpdate?.agent, ...this.profileForm.value };
      console.log('Submit :', result);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}