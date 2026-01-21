import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './Auth/auth-interceptor/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Gestion des requêtes HTTP avec ton Intercepteur de sécurité
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 2. Configuration des routes avec liaison automatique des paramètres (très utile en admin)
    provideRouter(routes, withComponentInputBinding()),
  ]
};