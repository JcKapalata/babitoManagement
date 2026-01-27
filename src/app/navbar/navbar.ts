import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth-service';
import { ProfileService } from '../Profile/profile-service';
import { VenteServices } from '../Gestion-vente/vente-services';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private readonly router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private venteService = inject(VenteServices);

  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  // Un seul flux qui contient les deux compteurs
  counts$ = this.venteService.getAlerteStatusCounts();

  isMobile: boolean = false;
  isShowedProduits: boolean = false;
  isShowedRH: boolean = false;
  isShowedVentes = false;

  ngOnInit(): void {
    this.isShowedProduits = false;
    this.isShowedRH = false;
    this.isShowedVentes = false;
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.isCollapsed = true; // Fermé par défaut sur mobile
  }

  // Toggle sidebar
  toggleMenu() {
    this.toggleSidebar.emit();
  }

  // ======= Toggle =======
  toggleProduits() {
    this.isShowedProduits = !this.isShowedProduits;
  }

  toogleVentes(){
    this.isShowedVentes = !this.isShowedVentes;
  }

  toggleRH(){
    this.isShowedRH = !this.isShowedRH;
  }

  // ====== go to Produit information =====
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

  // ===== go to profile information =====
  goToAjout(){
    this.router.navigate(['profile/add-profile'])
  }

  // ======= go to dashBord =======
  goToTableauBord(){
    this.router.navigate(['tableau-de-bord']);
  }

  // ======= go to personnel management =======
  goToListsAgents(){
    this.router.navigate(['manager/agents-list']);
  }

  goToListsClients(){
    this.router.navigate(['manager/clients-list']);
  }

  // Rediriger vers le profil
  goToProfile() {
    this.router.navigate(['profile/user-profile']);
  }

  // ========== go vente management =======
  goToVenteEncours(){
    this.router.navigate(['ventes/vente-encours']);
  }

  goToVenteNonLivrees(){
    this.router.navigate(['ventes/ventes-non-livres']);
  }
  
  goToVenteLivrees(){ 
    this.router.navigate(['ventes/ventes-livres']);
  }

  goToVenteAnnulees(){
    this.router.navigate(['ventes/ventes-annules']);
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
