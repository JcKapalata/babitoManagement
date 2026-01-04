import { Routes } from '@angular/router';
import { produits } from './Gestion-produits/produits';

export const routes: Routes = [
    // 1. Route SANS Navbar
    { 
        path: 'login', 
        loadComponent: () => import('./Auth/login/login').then(m => m.Login)
    },

    // 2. Routes AVEC Navbar (Enfants du MainLayout)
    {
        path: '',
        loadComponent: () => import('./Main-layout/main-layout').then(m => m.MainLayout),
        children: [
            { 
                path: 'tableau-de-bord', 
                loadComponent: () => import('./tableau-de-bord/tableau-de-bord').then(m => m.TableauDeBord) 
            },
            ...produits, // Vos routes produits seront injectées ici
            { 
                path: '', 
                redirectTo: 'tableau-de-bord', 
                pathMatch: 'full' 
            }
        ]
    }
];
