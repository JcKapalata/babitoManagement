import { Routes } from "@angular/router";
import { authGuard } from "../Auth/guard/auth-guard";

export const profile: Routes =[
    {
        path: 'profile/update-profile/:id',
        loadComponent: () => import('./update-profile/update-profile').then(m => m.UpdateProfile),
        canActivate: [authGuard]
    },
    {
        path: 'profile/add-profile',
        loadComponent: () => import('./add-profile/add-profile').then(m => m.AddProfile),
        canActivate: [authGuard]
    },
    {
        path: 'profile/user-profile',
        loadComponent: () => import('./view-profile/view-profile').then( m => m.ViewProfile),
        canActivate: [authGuard]
    }
]