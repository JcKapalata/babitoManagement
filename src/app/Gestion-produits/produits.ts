import { Routes } from "@angular/router";

export const produits: Routes = [
    { 
        path: 'produits/produits-disponibles', 
        loadComponent: () => import('./stock-produits/stock-produits').then(m => m.StockProduits) 
    },
]