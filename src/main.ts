import {enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {provideHttpClient} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage-angular";
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {Drivers} from "@ionic/storage";

if (environment.production) {
  enableProdMode();
}

void bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(IonicStorageModule.forRoot({
      name: '_punkDb',
      // Prefer SQLite in native
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
    }))
  ],
});
