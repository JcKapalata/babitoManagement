import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitsService } from '../Gestion-produits/produits-service';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tableau-de-bord.html',
  styleUrl: './tableau-de-bord.css'
})
export class TableauDeBord implements OnInit {
  private produitsService = inject(ProduitsService);

  stats = {
    totalProduits: 0,
    categories: 0,
    regions: 0,
    derniereMaj: new Date()
  };

  ngOnInit(): void {
    // On récupère le premier lot pour avoir le "total" global
    this.produitsService.getProduits(0, 1).subscribe(res => {
      this.stats.totalProduits = res.total;
      // Ici vous pourriez ajouter d'autres appels pour des stats précises
    });
  }
}