import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth-service';
import { ProfileService } from '../Profile/profile-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  isShowedProduits = false;

  ngOnInit(): void {
    this.isShowedProduits = false;
  }

  toggleProduits() {
    this.isShowedProduits = !this.isShowedProduits;
  }

  // go to Produit information
  goToProduitsDesponibles() {
    this.router.navigate(['produits/produits-disponibles']);
  }

  goToProduitsEpuises(){
    this.router.navigate(['produits/produits-epuises'])
  }

  goToProduitsFaibles(){
    this.router.navigate(['produits/produits-faibles'])
  }

  goToAjoutProduit(){
    this.router.navigate(['produits/ajout-produit'])
  }

  // go to dashBord
  goToTableauBord(){
    this.router.navigate(['tableau-de-bord']);
  }

  // Rediriger vers le profil
  goToProfile() {
    this.router.navigate(['profile/user-profile']);
  }

  // Déconnexion complète
  logout() {
    // 1. On vide le profil (BehaviorSubject + LocalStorage)
    this.profileService.clearProfile();
    
    // 2. On appelle la méthode logout du service Auth (Token + Redirection)
    this.authService.logout(); 
    
    console.log('Utilisateur déconnecté');
  }
}
