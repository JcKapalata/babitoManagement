import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  isShowedProduits = false;

  ngOnInit(): void {
    this.isShowedProduits = false;
  }

  toggleProduits() {
    this.isShowedProduits = !this.isShowedProduits;
  }

  goToProduitsDesponibles() {
    this.router.navigate(['produits/produits-disponibles']);
  }

  goToTableauBord(){
    this.router.navigate(['tableau-de-bord']);
  }
}
