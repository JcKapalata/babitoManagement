import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProduitsService } from '../produits-service';
import { ViewProduitsTables } from "../view-produits-tables/view-produits-tables";
import { Loading } from "../../loading/loading";
import { ProductDataSource } from '../product-data-source';

@Component({
  selector: 'app-stock-produits',
  imports: [CommonModule, ScrollingModule, ViewProduitsTables, Loading], 
  templateUrl: './stock-produits.html',
  styleUrl: './stock-produits.css',
})
export class StockProduits implements OnInit {
  private produitsService = inject(ProduitsService);
  dataSource!: ProductDataSource;

  ngOnInit() {
    this.dataSource = new ProductDataSource(this.produitsService);
  }
}