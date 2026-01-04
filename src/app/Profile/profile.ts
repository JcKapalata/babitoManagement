import { Routes } from "@angular/router";

export const profile: Routes =[
    {
        path: 'profile/update-profile/:id',
        loadComponent: () => import('./update-profile/update-profile').then(m => m.UpdateProfile)
    },
    {
        path: 'profile/add-profile',
        loadComponent: () => import('./add-profile/add-profile').then(m => m.AddProfile)
    },
    {
        path: 'profile/user-profile',
        loadComponent: () => import('./view-profile/view-profile').then( m => m.ViewProfile)
    }
]