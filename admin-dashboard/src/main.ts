import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/theme/interceptors/auth.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, HttpClientModule),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
}).catch((err) => console.error(err));
