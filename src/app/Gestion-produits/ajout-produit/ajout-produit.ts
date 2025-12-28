import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProduitsService } from '../produits-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout-produit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajout-produit.html',
  styleUrl: './ajout-produit.css',
})
export class AjoutProduit {
  private fb = inject(FormBuilder);
  private produitsService = inject(ProduitsService);
  private router = inject(Router);

  productForm: FormGroup = this.fb.group({
    nom: ['', Validators.required],
    codeProduit: ['', Validators.required],
    categorie: ['', Validators.required],
    description: [''],
    tailles: this.fb.array([]) // Liste dynamique de tailles
  });

  // Accès facile aux tailles
  get tailles() {
    return this.productForm.get('tailles') as FormArray;
  }

  // Ajouter une nouvelle taille
  ajouterTaille() {
    const tailleGroup = this.fb.group({
      nomTaille: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0.1)]],
      couleurs: this.fb.array([this.creerCouleur()]) // Au moins une couleur par taille
    });
    this.tailles.push(tailleGroup);
  }

  creerCouleur(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: [null] // Contiendra le fichier ou le chemin
    });
  }

  getCouleurs(indexTaille: number) {
    return this.tailles.at(indexTaille).get('couleurs') as FormArray;
  }

  ajouterCouleur(indexTaille: number) {
    this.getCouleurs(indexTaille).push(this.creerCouleur());
  }

  supprimerTaille(index: number) {
    this.tailles.removeAt(index);
  }

  supprimerCouleur(indexTaille: number, indexCouleur: number) {
    this.getCouleurs(indexTaille).removeAt(indexCouleur);
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Données à envoyer :', this.productForm.value);
      // Appel au service pour sauvegarder
      // this.produitsService.create(this.productForm.value).subscribe(...)
    }
  }
}