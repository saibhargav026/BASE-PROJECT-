import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { userInterceptorInterceptor } from './app/common/helpers/user.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppConfigServiceService } from './app/common/services/app-config-service.service';
import { routes } from './app/app.routes';
import { provideToastr } from 'ngx-toastr';
import { tap } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { AuthGuard } from './app/common/services/auth/auth-guard.service';
import { lastValueFrom } from 'rxjs';
import { provideRouter, withHashLocation } from "@angular/router";

if (environment.production) {
  enableProdMode();
}

// export function loadConfig(configService: AppConfigServiceService) {
//   return () => lastValueFrom(configService.loadConfig().pipe(
//     tap((config: any) => configService.setConfig(config))
//   ));
// }
export function loadConfig(configService: AppConfigServiceService) {
  return () => configService.loadConfig().pipe(
    tap((config:any) => configService.setConfig(config))
  ).toPromise();
}
bootstrapApplication(AppComponent, {
  providers: [
    AppConfigServiceService,
    { provide: APP_INITIALIZER, useClass: userInterceptorInterceptor, multi: true, useFactory: loadConfig, deps: [AppConfigServiceService] },
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: userInterceptorInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(
      // BrowserAnimationsModule is required by ngx-toastr
      BrowserAnimationsModule,
      NgxUiLoaderModule, NgxUiLoaderRouterModule.forRoot({ showForeground: true }),
      NgxUiLoaderHttpModule.forRoot({ showForeground: true }), //shows loader for all HTTP requests & shows loader automatically on route changes
    ),
    //Toaster Configuration
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      progressAnimation: 'increasing',
      progressBar: true,
      preventDuplicates: true
    }),
  ]
})
  .catch((err: any) => {
    console.error(err)
  });


