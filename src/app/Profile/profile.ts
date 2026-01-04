import { Routes } from "@angular/router";

export const profile: Routes =[
    {
        path: 'profile/user-profile',
        loadComponent: () => import('./view-profile/view-profile').then( m => m.ViewProfile)
    }
]