import { Routes } from "@angular/router";

export const produits: Routes = [
    { 
        path: 'produits/stock-produits', 
        loadComponent: () => import('./stock-produits/stock-produits').then(m => m.StockProduits) 
    },
]