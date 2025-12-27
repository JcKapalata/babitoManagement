import { Routes } from "@angular/router";

export const produits: Routes = [
    {
        path: 'produits/detail-produit/:id', 
        loadComponent: () => import('./detail-produit/detail-produit').then(m => m.DetailProduit) 
    },
    { 
        path: 'produits/produits-disponibles', 
        loadComponent: () => import('./stock-produits/stock-produits').then(m => m.StockProduits) 
    },
]