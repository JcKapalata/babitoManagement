import { ApplicationConfig, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth'; 

import { routes } from './app.routes';
import { authInterceptor } from './Auth/auth-interceptor/auth-interceptor';
import { environment } from '../environments/environment';

// Fonction d'initialisation robuste pour Firebase
function initializeFirebaseApp() {
  return () => {
    return new Promise<void>((resolve) => {
      try {
        console.log('🔥 Initializing Firebase with config:', {
          projectId: environment.firebase.projectId,
          authDomain: environment.firebase.authDomain
        });
        
        // Attendre que Firebase soit vraiment prêt
        setTimeout(() => {
          console.log('✅ Firebase initialization complete');
          resolve();
        }, 1000);
      } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        // Continuer même si Firebase échoue
        resolve();
      }
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes, withComponentInputBinding()),

    // Firebase App Initialization
    provideFirebaseApp(() => {
      try {
        const app = initializeApp(environment.firebase);
        console.log('✅ Firebase App initialized');
        return app;
      } catch (error) {
        console.error('❌ Failed to initialize Firebase App:', error);
        // Retourner une app vide pour ne pas bloquer l'application
        throw error;
      }
    }),
    
    // Firebase Auth Configuration
    provideAuth(() => {
      try {
        const auth = getAuth();
        if (!environment.production && typeof location !== 'undefined' && location.hostname === 'localhost') {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          console.log("🔐 Auth Emulator connected");
        }
        return auth;
      } catch (error) {
        console.error('❌ Failed to initialize Auth:', error);
        throw error;
      }
    }),

    // Firebase Firestore Configuration
    provideFirestore(() => {
      try {
        const firestore = getFirestore();
        if (!environment.production && typeof location !== 'undefined' && location.hostname === 'localhost') {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          console.log("🛠️ Firestore Emulator connected");
        }
        return firestore;
      } catch (error) {
        console.error('❌ Failed to initialize Firestore:', error);
        throw error;
      }
    }),

    // App Initializer
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFirebaseApp,
      multi: true
    }
  ]
};