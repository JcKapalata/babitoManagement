import { Routes } from "@angular/router";
import { authGuard } from "../Auth/guard/auth-guard";
// Si tu as un guard pour les admins, ajoute-le ici
// import { adminGuard } from "../Auth/guard/admin-guard"; 

export const personnelRoutes: Routes = [
    {
        path: 'manager/agents-list',
        loadComponent: () => import('./liste-agents/liste-agents').then(m => m.ListeAgents),
        canActivate: [authGuard] // + adminGuard si disponible
    },
];