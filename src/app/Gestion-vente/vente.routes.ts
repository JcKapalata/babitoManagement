import { Routes } from "@angular/router";
import { authGuard } from "../Auth/guard/auth-guard";


export const ventes: Routes = [
    {
        path: 'ventes/detail-vente/:id',
        loadComponent: () => import('./detail-vente/detail-vente').then(m => m.DetailVente),
        canActivate: [authGuard]
    },
    {
        path: 'ventes/vente-encours', 
        loadComponent: () => import('./vente-en-cours/vente-en-cours').then(m => m.VenteEnCours),
        canActivate: [authGuard] 
    },
    {
        path: 'ventes/ventes-non-livres', 
        loadComponent: () => import('./vente-non-livre/vente-non-livre').then(m => m.VenteNonLivre),
        canActivate: [authGuard]
    },
    {
        path: 'ventes/ventes-livres', 
        loadComponent: () => import('./vente-livre/vente-livre').then(m => m.VenteLivre),
        canActivate: [authGuard]
    },
    {
        path: 'ventes/ventes-annules', 
        loadComponent: () => import('./vente-annuler/vente-annuler').then(m => m.VenteAnnuler),
        canActivate: [authGuard]
    }

]