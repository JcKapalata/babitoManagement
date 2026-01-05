import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from './data';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Auth/auth-interceptor/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes),
    importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(DataService, {
        dataEncapsulation: false
      }))
  ]
};
