import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produit } from '../../Models/produit';
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
  private readonly produitsService = inject(ProduitsService);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  // Initialisation du formulaire avec tous les champs de ton interface
  productForm: FormGroup = this.fb.group({
    codeFournisseur: ['', Validators.required],
    codeProduit: ['', Validators.required],
    nom: ['', Validators.required],
    devise: ['USD', Validators.required],
    region: ['Goma', Validators.required],
    classement: ['', Validators.required],
    categorie: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
    // FormArray temporaire pour la saisie utilisateur
    taillesArray: this.fb.array([]) 
  });

  // Getter pour accéder facilement au tableau des tailles dans le HTML
  get taillesArray(): FormArray {
    return this.productForm.get('taillesArray') as FormArray;
  }

  // Ajouter une nouvelle taille (ex: "6-9 mois")
  ajouterTaille(): void {
    const tailleGroup = this.fb.group({
      nomTaille: ['', Validators.required], // La clé de l'objet (ex: '6-9 mois')
      prix: [0, [Validators.required, Validators.min(0.01)]],
      couleurs: this.fb.array([this.creerCouleur()]) // Commence avec une couleur par défaut
    });
    this.taillesArray.push(tailleGroup);
  }

  // Créer le groupe de champs pour une couleur
  creerCouleur(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      image: ['', Validators.required], // Contiendra le Base64 pour la preview
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Getter pour accéder aux couleurs d'une taille spécifique
  getCouleurs(indexTaille: number): FormArray {
    return this.taillesArray.at(indexTaille).get('couleurs') as FormArray;
  }

  // Ajouter une couleur à une taille (Appelé par le bouton (click) dans le HTML)
  ajouterCouleur(indexTaille: number): void {
    this.getCouleurs(indexTaille).push(this.creerCouleur());
  }

  // Supprimer une taille
  supprimerTaille(index: number): void {
    this.taillesArray.removeAt(index);
  }

  // Supprimer une couleur spécifique
  supprimerCouleur(indexTaille: number, indexCouleur: number): void {
    const couleurs = this.getCouleurs(indexTaille);
    if (couleurs.length > 1) {
      couleurs.removeAt(indexCouleur);
    }
  }

  // Gestion de la sélection d'image et conversion en Base64
  onFileSelected(event: any, indexTaille: number, indexCouleur: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const couleurForm = this.getCouleurs(indexTaille).at(indexCouleur);
        couleurForm.patchValue({ image: reader.result });
        
        // Indique à Angular que l'image a changé pour éviter l'erreur NG0100
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);
    }
  }

  // Soumission et transformation des données
  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      // 1. Transformation du FormArray vers l'index signature { [key: string]: ... }
      const tailleMapping: { [key: string]: any } = {};
      
      formValue.taillesArray.forEach((t: any) => {
        tailleMapping[t.nomTaille] = {
          prix: t.prix,
          couleurs: t.couleurs.map((c: any) => ({
            nom: c.nom,
            image: c.image,
            stock: c.stock
          }))
        };
      });

      // 2. Construction de l'objet final (Partial<Produit>)
      const nouveauProduit: Partial<Produit> = {
        codeFournisseur: formValue.codeFournisseur,
        codeProduit: formValue.codeProduit,
        nom: formValue.nom,
        devise: formValue.devise,
        region: formValue.region,
        classement: formValue.classement,
        categorie: formValue.categorie,
        type: formValue.type,
        description: formValue.description,
        dateAjout: new Date(),
        dateModification: new Date(),
        taille: tailleMapping
      };

      // 3. Appel au service avec gestion de la réponse
      this.produitsService.postProduit(nouveauProduit).subscribe({
        next: (res) => {
          console.log('Produit ajouté avec succès !', res);
          alert('Le produit "' + formValue.nom + '" a été enregistré avec succès.');
          this.router.navigate(['produits/produits-disponibles']); 
        },
        error: (err) => {
          console.error('Erreur API:', err);
          alert('Erreur lors de l\'enregistrement : ' + err.message);
        }
      });

    } else {
      // Affichage des erreurs si le formulaire est invalide
      this.productForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs obligatoires correctement.');
    }
  }

}