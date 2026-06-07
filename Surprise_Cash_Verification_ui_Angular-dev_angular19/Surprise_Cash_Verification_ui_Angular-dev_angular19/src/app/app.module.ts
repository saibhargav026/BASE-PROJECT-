import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { DatepickerModule } from 'ng2-datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { SurpriseCashComponent } from './modules/surprise-cash/surprise-cash.component';
import { HeaderComponent } from './modules/common/header/header.component';
import { FooterComponent } from './modules/common/footer/footer.component';

import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { AuthenticationService } from './common/services/auth/authentication.service';
import { AuthGuard } from './common/services/auth/auth-guard.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PersistenceService } from './common/services/persistence.service';
import { ApiService } from './common/services/api.service';
import { SurpriseCashService } from './common/services/surprise-cash.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogPopupComponent } from './modules/dialog-popup/dialog-popup.component';
import { FilterPipe } from './filter.pipe';
import { SessionService } from './common/services/session.service';
import { userInterceptorInterceptor } from './common/helpers/user.interceptor';
import { AppConfigServiceService } from './common/services/app-config-service.service';
import { tap } from 'rxjs';


export function loadConfig(configService: AppConfigServiceService) {
  return () => configService.loadConfig().pipe(
    tap((config:any) => configService.setConfig(config))
  ).toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SurpriseCashComponent,
    HeaderComponent,
    FooterComponent,
    DialogPopupComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxUiLoaderModule, NgxUiLoaderRouterModule.forRoot({ showForeground: true }),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      progressAnimation: 'increasing',
      progressBar: true,
    }),
    MatStepperModule,
    MatIconModule,
    DatepickerModule, MatRadioModule
  ],
  providers: [ { provide: APP_INITIALIZER, useClass: userInterceptorInterceptor, multi: true, useFactory: loadConfig, deps: [AppConfigServiceService] }, DatePipe, AuthGuard, PersistenceService, ApiService, SurpriseCashService, SessionService
  ,{provide:HTTP_INTERCEPTORS,useClass:userInterceptorInterceptor,multi:true}],

  
  bootstrap: [AppComponent]
})
export class AppModule { }
