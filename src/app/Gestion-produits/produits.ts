import { Routes } from "@angular/router";
import { authGuard } from "../Auth/guard/auth-guard";

export const produits: Routes = [
    // Route par défaut pour /produits
    { 
        path: 'produits', 
        loadComponent: () => import('./stock-produits/stock-produits').then(m => m.StockProduits),
        canActivate: [authGuard] 
    },
    {
        path: 'produits/detail-produit/:id', 
        loadComponent: () => import('./detail-produit/detail-produit').then(m => m.DetailProduit),
        canActivate: [authGuard] 
    },
    {
        path: 'produits/updater-produit/:id',
        loadComponent: () => import('./update-produit/update-produit').then(m => m.UpdateProduit),
        canActivate: [authGuard]
    },
    {
        path: 'produits/ajout-produit', 
        loadComponent: () => import('./ajout-produit/ajout-produit').then(m => m.AjoutProduit),
        canActivate: [authGuard]
    },
    {
        path: 'produits/produits-epuises',
        loadComponent: () => import('./produit-epuises/produit-epuises').then(m => m.ProduitEpuises),
        canActivate: [authGuard]
    },
    {
        path: 'produits/produits-faibles',
        loadComponent: () => import('./produit-faibles/produit-faibles').then(m => m.ProduitFaibles),
        canActivate: [authGuard]
    },
    { 
        path: 'produits/produits-disponibles', 
        loadComponent: () => import('./stock-produits/stock-produits').then(m => m.StockProduits),
        canActivate: [authGuard] 
    },
]