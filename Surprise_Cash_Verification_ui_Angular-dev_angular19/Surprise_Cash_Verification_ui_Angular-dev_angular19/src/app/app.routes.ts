import { Routes } from "@angular/router";
import { AuthGuard } from "./common/services/auth/auth-guard.service";

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./modules/login/login.component').then(c => c.LoginComponent) },
    { path: 'annexure', loadComponent: () => import('./modules/surprise-cash/surprise-cash.component').then(c => c.SurpriseCashComponent) },
    { path: 'admin-list', loadComponent: () => import('./modules/admin/admin-list/admin-list.component').then(c => c.AdminListComponent), canActivate: [AuthGuard] },
    { path: 'add-admin', loadComponent: () => import('./modules/admin/add-admin/add-admin.component').then(c => c.AddAdminComponent), canActivate: [AuthGuard] },
    { path: 'admin-navbar', loadComponent: () => import('./modules/admin/admin-navbar/admin-navbar.component').then(c => c.AdminNavbarComponent), canActivate: [AuthGuard] },
    { path: 'edit-admin/:id', loadComponent: () => import('./modules/admin/edit-admin/edit-admin.component').then(c => c.EditAdminComponent), canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];