import { Component, inject } from '@angular/core';
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
  private readonly route = inject(ActivatedRoute)
  produitUpdater?: Produit;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.produitUpdater = undefined; 

        this.produitsService.getProduitById(+id).subscribe({
          next: (produit) => {
            this.produitUpdater = produit;
            console.log("Produit chargé pour modification :", produit);
          },
          error: (err) => {
            console.error("Erreur de chargement :", err);
          }
        });
      }
    });
  }
}
