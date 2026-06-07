import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { SwalMasterService } from '../swal-master.service';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService, private swal: SwalMasterService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isUserLoggedIn())
      return true;

    this.router.navigate(['login']);
    // this.swal.showMessage('Please login to continue!!!', 'error')
    // this.toastr.error('ACCESS_DENIED','Un-Authorized to access');
    return false;
  }
  //Mounika Online locker
  // private lastRoute:string='';
  // private isInternalNavigation = false;

  // constructor(private router:Router,private authService: AuthenticationService){
  //   // Subscribe to router events to detect in-app navigations
  //    this.router.events.subscribe((event: any) =>{
  //      if(event instanceof NavigationEnd){
  //       this.lastRoute =event.urlAfterRedirects;
  //       sessionStorage.setItem('lastRoute', this.lastRoute);
  //       this.isInternalNavigation =true;
  //      }
  //    });

  //    //Detect manual URL typing or page refresh
  //    window.addEventListener('popstate', () =>{
  //      this.isInternalNavigation =false;
  //    });
  // }
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
  //   const targetUrl = state.url;
  //   const lastVisited = this.lastRoute || sessionStorage.getItem('lastRoute');

  //   //always allow login page
  //   if(targetUrl ==='/login' || targetUrl ==='/'){
  //     return true;
  //   }
  //   //allow if navigation happened within the app
  //   if(this.isInternalNavigation){
  //     return true;
  //   }
  //   //if user typed URL manually or refreshed
  //   if(lastVisited){
  //     this.router.navigateByUrl(lastVisited); //stay on the last visit page
  //     return false;
  //   }
  //   //Default fallback -go to login
  //   // this.router.navigate(['/login']);

   
  //   return true;
  // }
}
