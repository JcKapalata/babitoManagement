import { Routes } from '@angular/router';
import { produits } from './Gestion-produits/produits';
import { profile } from './Profile/profile';
import { authGuard } from './Auth/guard/auth-guard';
import { personnelRoutes } from './Gestion-personnel/personnel';
import { ventes } from './Gestion-vente/vente.routes';

export const routes: Routes = [
    // 1. Redirection par défaut (À METTRE EN PREMIER)
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // 2. Route de Login
    { 
        path: 'login', 
        loadComponent: () => import('./Auth/login/login').then(m => m.Login)
    },

    // 3. Routes protégées avec Navbar
    {
        path: '',
        loadComponent: () => import('./Main-layout/main-layout').then(m => m.MainLayout),
        children: [
            { 
                path: 'tableau-de-bord', 
                loadComponent: () => import('./tableau-de-bord/tableau-de-bord').then(m => m.TableauDeBord),
                canActivate: [authGuard] 
            },
            ...profile,
            ...produits,
            ...ventes,
            ...personnelRoutes
        ]
    },

    // 4. Gestion des erreurs (facultatif)
    { path: '**', loadComponent: () => import('./page-not-found/page-not-found').then(m => m.PageNotFound) }
];
