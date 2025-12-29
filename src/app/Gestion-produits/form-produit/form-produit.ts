import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProduitsService } from '../produits-service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Produit } from '../../Models/produit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-produit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-produit.html',
  styleUrl: './form-produit.css',
})
export class FormProduit {
  private readonly produitsService = inject(ProduitsService);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  productForm: FormGroup = this.fb.group({
    codeFournisseur: ['', Validators.required],
    codeProduit: ['', Validators.required],
    nom: ['', [Validators.required, Validators.minLength(3)]],
    devise: ['USD', Validators.required],
    region: ['Goma', Validators.required],
    classement: ['', Validators.required],
    categorie: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    taillesArray: this.fb.array([], [Validators.required, this.minLengthArray(1)])
  });

  private minLengthArray(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray && control.length >= min) return null;
      return { minLengthArray: true };
    };
  }

  get taillesArray(): FormArray {
    return this.productForm.get('taillesArray') as FormArray;
  }

  getCouleurs(indexTaille: number): FormArray {
    return this.taillesArray.at(indexTaille).get('couleurs') as FormArray;
  }

  ajouterTaille(): void {
    const tailleGroup = this.fb.group({
      nomTaille: ['', Validators.required],
      prix: [null, [Validators.required, Validators.min(0.01)]],
      couleurs: this.fb.array([this.creerCouleur()], [Validators.required, this.minLengthArray(1)])
    });
    this.taillesArray.push(tailleGroup);
  }

  creerCouleur(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      image: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ajouterCouleur(indexTaille: number): void {
    this.getCouleurs(indexTaille).push(this.creerCouleur());
  }

  onFileSelected(event: Event, indexTaille: number, indexCouleur: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop lourde (Max 2Mo)");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const control = this.getCouleurs(indexTaille).at(indexCouleur).get('image');
        control?.setValue(reader.result);
        control?.markAsTouched();
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const val = this.productForm.value;
      const tailleMapping: any = {};
      
      // Mapping dynamique conforme à votre interface
      val.taillesArray.forEach((t: any) => {
        tailleMapping[t.nomTaille] = {
          prix: t.prix,
          couleurs: t.couleurs.map((c: any) => ({
            nom: c.nom,
            image: c.image,
            stock: parseInt(c.stock, 10)
          }))
        };
      });

      const nouveauProduit: Partial<Produit> = {
        codeFournisseur: val.codeFournisseur,
        codeProduit: val.codeProduit,
        nom: val.nom,
        devise: val.devise,
        region: val.region,
        classement: val.classement,
        categorie: val.categorie,
        type: val.type,
        description: val.description,
        dateAjout: new Date(),
        dateModification: new Date(),
        taille: tailleMapping
      };

      this.produitsService.postProduit(nouveauProduit).subscribe({
        next: () => {
          alert('Produit enregistré avec succès !');
          this.router.navigate(['produits/produits-disponibles']);
        },
        error: (err) => alert('Erreur : ' + err.message)
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}