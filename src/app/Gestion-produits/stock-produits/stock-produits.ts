import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProduitsService } from '../produits-service';
import { map, Observable } from 'rxjs';
import { Produit } from '../../Models/produit';
import { ViewProduitsTables } from "../view-produits-tables/view-produits-tables";
import { Loading } from "../../loading/loading";

@Component({
  selector: 'app-stock-produits',
  imports: [CommonModule, ScrollingModule, ViewProduitsTables, Loading], 
  templateUrl: './stock-produits.html',
  styleUrl: './stock-produits.css',
})
export class StockProduits implements OnInit {
  private produitsService = inject(ProduitsService);
  
  // Le symbole '$' indique que c'est un flux de données (Observable)
  produits$!: Observable<Produit[]>; 

  ngOnInit() {
    // On appelle notre service robuste (avec cache et retry)
    this.produits$ = this.produitsService.getProduits().pipe(
      // On extrait la propriété 'items' qui contient le tableau Produit[]
      map((response: { items: any; }) => response.items) 
    );
  }

  trackByProduitId(index: number, produit: Produit): number {
    return produit.id; // Aide Angular à ne redessiner que ce qui change
  }
}