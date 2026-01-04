import { Routes } from "@angular/router";

export const profile: Routes =[
    {
        path: 'profile/user-profile',
        loadComponent: () => import('./view-profile/view-profile').then( m => m.ViewProfile)
    },
    {
        path: 'profile/update-profile/:id',
        loadComponent: () => import('./update-profile/update-profile').then(m => m.UpdateProfile)
    }
]