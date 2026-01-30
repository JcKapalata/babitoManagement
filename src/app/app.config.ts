import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth'; 

// Application Imports
import { routes } from './app.routes';
import { authInterceptor } from './Auth/auth-interceptor/auth-interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Gestion des requêtes HTTP avec ton Intercepteur de sécurité
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 2. Configuration du Routage (avec binding des inputs pour plus de robustesse)
    provideRouter(
      routes, 
      withComponentInputBinding(),
      withViewTransitions() // Optionnel : pour des transitions fluides entre pages
    ),

    // 3. Initialisation de Firebase App
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // 4. Configuration Firestore avec protection Émulateur
    provideFirestore(() => {
      const firestore = getFirestore();
      // On n'active l'émulateur QUE si on est en mode dev ET que la config le permet
      if (isDevMode() && !environment.production) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        console.warn('⚠️ Firestore: Utilisation de l’émulateur local');
      }
      return firestore;
    }),

    // 5. Configuration Firebase Auth
    provideAuth(() => {
      const auth = getAuth();
      if (isDevMode() && !environment.production) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        console.warn('⚠️ Auth: Utilisation de l’émulateur local');
      }
      return auth;
    })
  ]
};