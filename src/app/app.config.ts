import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
// AJOUT DES IMPORTS AUTH
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth'; 

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
    
    // CONFIGURATION AUTH (Indispensable pour ProfileService)
    provideAuth(() => {
      const auth = getAuth();
      if (!environment.production && typeof location !== 'undefined' && location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://localhost:9099');
        console.log("🔐 Émulateur Auth activé sur le port 9099");
      }
      return auth;
    }),

    provideFirestore(() => {
      const firestore = getFirestore();
      if (!environment.production && typeof location !== 'undefined' && location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        console.log("🛠️ Émulateur Firestore activé sur le port 8080");
      } 
      return firestore;
    }),
  ]
};