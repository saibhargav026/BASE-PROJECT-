import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class userInterceptorInterceptor implements HttpInterceptor {
  UserId: any;
  token: any;
  constructor() {
    this.UserId = sessionStorage.getItem("UserId")?.toString();
    this.token = sessionStorage.getItem("Token")?.toString();
    // console.log(this.token);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var reqcopy = req.clone({
      headers: req.headers.set("UserId", this.UserId)
    });
    if (sessionStorage.getItem("Token")?.toString()) {
      reqcopy = req.clone({
        setHeaders: { Authorization: "Bearer " + sessionStorage.getItem("Token")?.toString() }
      })
    }
    else {
      reqcopy = req.clone({
        setHeaders: { Authorization: "Bearer " + ' ' }
      })
    }
    return next.handle(reqcopy);
  }
}
