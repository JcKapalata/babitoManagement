import { Routes } from "@angular/router";

export const produits: Routes = [
    {
        path: 'produits/detail-produit/:id', 
        loadComponent: () => import('./detail-produit/detail-produit').then(m => m.DetailProduit) 
    },
    {
        path: 'produits/ajout-produit', 
        loadComponent: () => import('./ajout-produit/ajout-produit').then(m => m.AjoutProduit)
    },
    {
        path: 'produits/produits-epuises',
        loadComponent: () => import('./produit-epuises/produit-epuises').then(m => m.ProduitEpuises)
    },
    {
        path: 'produits/produits-faibles',
        loadComponent: () => import('./produit-faibles/produit-faibles').then(m => m.ProduitFaibles)
    },
    { 
        path: 'produits/produits-disponibles', 
        loadComponent: () => import('./stock-produits/stock-produits').then(m => m.StockProduits) 
    },
]