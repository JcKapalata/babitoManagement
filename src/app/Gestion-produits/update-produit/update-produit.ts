import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormProduit } from "../form-produit/form-produit";
import { ProduitsService } from '../produits-service';
import { ActivatedRoute } from '@angular/router';
import { Produit } from '../../Models/produit';
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-update-produit',
  imports: [FormProduit, Loading],
  templateUrl: './update-produit.html',
  styleUrl: './update-produit.css',
})
export class UpdateProduit {
  private readonly produitsService = inject(ProduitsService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef); // Indispensable pour forcer l'affichage
  
  produitUpdater?: Produit;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        // 1. On vide l'ancien produit pour forcer l'affichage du loader
        this.produitUpdater = undefined; 
        this.cdr.detectChanges(); 

        // 2. Appel au service
        this.produitsService.getProduitById(id).subscribe({
          next: (produit) => {
            if (produit) {
              this.produitUpdater = produit;
              console.log("Produit chargé avec succès :", produit);
              // 3. On force manuellement Angular à rafraîchir la vue
              this.cdr.detectChanges(); 
            }
          },
          error: (err) => {
            console.error("Erreur de chargement :", err);
          }
        });
      }
    });
  }
}
