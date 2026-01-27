import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ProduitsService } from '../produits-service';
import { Router } from '@angular/router';
import { 
  FormArray, 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { Produit } from '../../Models/produit';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../Notification/notification-service';

@Component({
  selector: 'app-form-produit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-produit.html',
  styleUrl: './form-produit.css',
})
export class FormProduit implements OnInit {  
  @Input() produitInitial?: Produit; // Reçoit le produit en cas d'update

  private readonly produitsService = inject(ProduitsService);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notify = inject(NotificationService);

  productForm: FormGroup = this.fb.group({
    codeFournisseur: ['', Validators.required],
    codeProduit: ['', Validators.required],
    nom: ['', [Validators.required, Validators.minLength(3)]],
    devise: ['USD', Validators.required],
    region: ['', [Validators.required, Validators.minLength(3)]],
    classement: ['', Validators.required],
    categorie: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    taillesArray: this.fb.array([], [this.minLengthArray(1)])
  });

  ngOnInit(): void {
    // Si on a un produit initial, on remplit le formulaire
    if (this.produitInitial) {
      this.remplirFormulaire(this.produitInitial);
    } else {
      // Sinon on ajoute une taille vide par défaut pour la création
      this.ajouterTaille();
    }
    
    // Debug: Afficher l'état du formulaire
    console.log('[FormProduit] Formulaire initialisé');
    console.log('[FormProduit] Valide:', this.productForm.valid);
    console.log('[FormProduit] Erreurs:', this.productForm.errors);
    console.log('[FormProduit] TaillesArray:', this.taillesArray.length);
    console.log('[FormProduit] TaillesArray valide:', this.taillesArray.valid);
    console.log('[FormProduit] TaillesArray erreurs:', this.taillesArray.errors);
    
    // Écouter les changements du formulaire
    this.productForm.statusChanges.subscribe(status => {
      console.log('[FormProduit] Statut du formulaire changé:', status);
      console.log('[FormProduit] Valide:', this.productForm.valid);
      console.log('[FormProduit] Erreurs:', this.productForm.errors);
    });
    
    // Écouter les changements du taillesArray
    this.taillesArray.statusChanges.subscribe(status => {
      console.log('[FormProduit] Statut du taillesArray changé:', status);
      console.log('[FormProduit] TaillesArray valide:', this.taillesArray.valid);
      console.log('[FormProduit] TaillesArray erreurs:', this.taillesArray.errors);
    });
  }

  // Remplit les champs et les FormArray dynamiquement
  private remplirFormulaire(produit: Produit): void {
    this.productForm.patchValue({
      codeFournisseur: produit.codeFournisseur,
      codeProduit: produit.codeProduit,
      nom: produit.nom,
      devise: produit.devise,
      region: produit.region,
      classement: produit.classement,
      categorie: produit.categorie,
      type: produit.type,
      description: produit.description
    });

    if (produit.tailles) {
      Object.keys(produit.tailles).forEach(key => {
        const t = produit.tailles![key];
        const tailleGroup = this.fb.group({
          nomTaille: [key, Validators.required],
          prix: [t.prix, [Validators.required, Validators.min(0.01)]],
          couleurs: this.fb.array([], [Validators.required, this.minLengthArray(1)])
        });

        const couleursArray = tailleGroup.get('couleurs') as FormArray;
        t.couleurs.forEach(c => {
          couleursArray.push(this.fb.group({
            nom: [c.nom, Validators.required],
            image: [c.image, Validators.required],
            stock: [c.stock, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]]
          }));
        });

        this.taillesArray.push(tailleGroup);
      });
    }
  }

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
      prix: ['', [Validators.required, Validators.min(0.01)]],
      couleurs: this.fb.array([this.creerCouleur()], [Validators.required, this.minLengthArray(1)])
    });
    this.taillesArray.push(tailleGroup);
    console.log('[FormProduit] Taille ajoutée. Formulaire valide:', this.productForm.valid);
  }

  creerCouleur(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      image: ['', Validators.required],
      stock: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ajouterCouleur(indexTaille: number): void {
    this.getCouleurs(indexTaille).push(this.creerCouleur());
  }

  onFileSelected(event: Event, indexTaille: number, indexCouleur: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.size > 20 * 1024 * 1024) {
        this.notify.showError("L'image est trop lourde Max 20 Mo");
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
    console.log('[FormProduit] onSubmit appelé');
    console.log('[FormProduit] Formulaire valide:', this.productForm.valid);
    console.log('[FormProduit] Erreurs du formulaire:', this.productForm.errors);
    console.log('[FormProduit] Valeur du formulaire:', this.productForm.value);
    
    if (this.productForm.valid) {
      const val = this.productForm.value;
      const tailleMapping: any = {};
      
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

      const produitData: Partial<Produit> = {
        id: this.produitInitial?.id,
        codeFournisseur: val.codeFournisseur,
        codeProduit: val.codeProduit,
        nom: val.nom,
        devise: val.devise,
        region: val.region,
        classement: val.classement,
        categorie: val.categorie,
        type: val.type,
        description: val.description,
        dateModification: new Date(),
        tailles: tailleMapping
      };

      if (this.produitInitial && this.produitInitial.id) {
        // MODE UPDATE
        const currentId = this.produitInitial.id;
        console.log("ID détecté pour update:", this.produitInitial.id);
        this.produitsService.updateProduit(this.produitInitial.id, produitData).subscribe({
          next: (res) => {
            this.notify.showSuccess('Produit mis à jour !');
            this.router.navigate(['produits/detail-produit/', currentId]);
          },
          error: (err) => this.notify.showError('Erreur Update : ' + err.message)
        });
      } else {
        // MODE POST
        const nouveauProduit = { ...produitData, dateAjout: new Date() };
        this.produitsService.postProduit(nouveauProduit).subscribe({
          next: () => {
            this.notify.showSuccess('Produit enregistré !');
            this.router.navigate(['produits/produits-disponibles']);
          },
          error: (err) => this.notify.showError('Erreur Post : ' + err.message)
        });
      }
    } else {
      console.log('[FormProduit] Formulaire invalide, marquage de tous les champs comme touchés');
      this.productForm.markAllAsTouched();
    }
  }
}