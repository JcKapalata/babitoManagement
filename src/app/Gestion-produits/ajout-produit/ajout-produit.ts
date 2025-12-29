import {  Component } from '@angular/core';
import { FormProduit } from "../form-produit/form-produit";

@Component({
  selector: 'app-ajout-produit',
  standalone: true,
  imports: [FormProduit],
  templateUrl: './ajout-produit.html',
  styleUrl: './ajout-produit.css',
})
export class AjoutProduit {
  

}