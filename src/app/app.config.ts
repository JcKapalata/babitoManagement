import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// ✅ IMPORTATION CORRIGÉE : Ajout de connectFirestoreEmulator
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { 
  provideFirestore, 
  getFirestore, 
  connectFirestoreEmulator // <-- Il manquait cet import
} from '@angular/fire/firestore';

import { routes } from './app.routes';
import { authInterceptor } from './Auth/auth-interceptor/auth-interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideRouter(routes, withComponentInputBinding()),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    
    provideFirestore(() => {
      const firestore = getFirestore();

      // ✅ Logique de basculement automatique
      // On vérifie si on n'est pas en production ET qu'on est sur localhost
      if (!environment.production && typeof location !== 'undefined' && location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        console.log("🛠️ Émulateur Firestore activé sur le port 8080");
      } 
      
      return firestore;
    }),
  ]
};