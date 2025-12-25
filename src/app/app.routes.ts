import { Routes } from '@angular/router';
import { produits } from './Gestion-produits/produits';

export const routes: Routes = [
    ...produits,
    { path: '', redirectTo: 'produits/stock-produits', pathMatch: 'full' }
];
