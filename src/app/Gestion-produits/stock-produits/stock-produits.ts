import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProduitsService } from '../produits-service';
import { Loading } from "../../loading/loading";
import { ProductDataSource } from '../product-data-source';
import { Produit } from '../../Models/produit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-produits',
  imports: [CommonModule, ScrollingModule, Loading], 
  templateUrl: './stock-produits.html',
  styleUrl: './stock-produits.css',
})
export class StockProduits implements OnInit {
  private produitsService = inject(ProduitsService);
  private router = inject(Router);
  dataSource!: ProductDataSource;

  ngOnInit() {
    this.dataSource = new ProductDataSource(this.produitsService);
  }

  onRowClick(row: Produit | undefined) {
    if (row && row.id) {
      this.router.navigate(['produits/detail-produit/', row.id]);
      }
  }
}