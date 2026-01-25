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
]