import { Routes } from '@angular/router';
import { produits } from './Gestion-produits/produits';

export const routes: Routes = [
    ...produits,
    { path: 'tableau-de-bord', loadComponent: () => import('./tableau-de-bord/tableau-de-bord').then(m => m.TableauDeBord) },
    { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' }
];
