import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { SurpriseCashComponent } from './modules/surprise-cash/surprise-cash.component';
import { AppCustomPreloader } from './common/pre-loaders/app-custom-preloader.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'annexure', component: SurpriseCashComponent }
];

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: AppCustomPreloader }), RouterModule.forRoot(appRoutes, { useHash: true })],
  providers: [AppCustomPreloader],
  exports: [RouterModule]
})
export class AppRoutingModule { }
