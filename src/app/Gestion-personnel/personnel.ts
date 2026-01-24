import { Routes } from "@angular/router";
import { authGuard } from "../Auth/guard/auth-guard";
// Si tu as un guard pour les admins, ajoute-le ici
// import { adminGuard } from "../Auth/guard/admin-guard"; 

export const personnelRoutes: Routes = [
    {
        path: 'manager/personnel-detail/:id',
        loadComponent: () => import('./detail-personnel/detail-personnel').then(m => m.DetailPersonnel),
        canActivate: [authGuard] // + adminGuard si disponible
    },
    {
        path: 'manager/agents-list',
        loadComponent: () => import('./liste-agents/liste-agents').then(m => m.ListeAgents),
        canActivate: [authGuard] // + adminGuard si disponible
    },
    {
        path: 'manager/clients-list', 
        loadComponent: () => import('./liste-clients/liste-clients').then(m => m.ListeClients),
        canActivate: [authGuard]
    },
];