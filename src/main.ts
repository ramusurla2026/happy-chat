import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/intercepture/auth-interceptor';
import { loaderInterceptor } from './app/core/intercepture/loader-interceptor';
import { register } from 'swiper/element/bundle';   // 👈 Add this
import { errorInterceptor } from './app/core/intercepture/error-interceptor';

register();   // 👈 Add this

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
       withInterceptors([
        loaderInterceptor,
        authInterceptor,
        errorInterceptor
      ])
    ),
  ],
});
