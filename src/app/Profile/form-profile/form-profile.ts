import { Component, inject, OnInit, Input, ChangeDetectorRef, NgZone } from '@angular/core';
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
  private zone = inject(NgZone);

  profileForm!: FormGroup;
  roles = ['admin', 'livreur', 'finance'];
  isUpdateMode = false;
  imagePreview: string | null = null;

  @Input() set userToUpdate(value: User | null) {
    if (value?.agent) {
      this.isUpdateMode = true;
      // On s'assure que le formulaire est prêt
      if (!this.profileForm) this.initForm();
      
      // Technique CDR + Zone pour remplissage immédiat
      this.zone.run(() => {
        this.patchData(value);
        this.cdr.detectChanges(); // Force le rendu des inputs simples
      });
    }
  }

  ngOnInit() {
    if (!this.profileForm) this.initForm();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      avatar: [''], 
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Ajuste les validateurs si on est en création
    if (!this.isUpdateMode) {
      this.profileForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  private patchData(user: User) {
    this.profileForm.patchValue({
      firstName: user.agent.firstName,
      lastName: user.agent.lastName,
      email: user.agent.email,
      role: user.agent.role,
      avatar: user.agent.avatar
    });
    this.imagePreview = user.agent.avatar || null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onFileSelected(event: Event) {
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

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) return 'Obligatoire';
    if (control?.hasError('email')) return 'Email invalide';
    if (control?.hasError('passwordMismatch')) return 'Mots de passe différents';
    return '';
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Submit:', this.profileForm.value);
    } else {
      this.profileForm.markAllAsTouched();
      this.cdr.detectChanges();
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}