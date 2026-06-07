import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { AppConfigServiceService } from './app-config-service.service';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _persistanceService: PersistenceService, private configService: AppConfigServiceService,
    private _http: HttpClient) { }

  private constructUrl(reqParams: root.branch.IApiConfig,) {
    let url = '';
    //url = environment.config.baseUrl + "" + environment.config.apiVersion
    url = this.configService.getConfig('baseUrl');
    url = url + reqParams.url;
    return url;
  }

  getData<T>(reqParams: root.branch.IApiConfig): Observable<T> {

    // let currentUser: root.branch.IUser = <root.branch.IUser>this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER);

    let headers: any = {}

    headers = {
      'Content-Type': 'application/json;',
      //'Accept': 'application/json, text/plain, */*',
      //  'X-Forwarded-For': this.getClientIp(),
      //  / 'Authorization': 'Bearer ' + currentUser.token,
      //'X-TraceId': this.getTraceId(),
      // 'X-Feature-Flags': 'smsEnabled=true,notificationEnabled=true',
    }

    if (reqParams.headers) {
      for (let headerKey in reqParams.headers) {
        headers[headerKey] = reqParams.headers[headerKey];
      }
    }

    let httpHeaders = new HttpHeaders(headers);

    return this._http.get<T>(this.constructUrl(reqParams), {
      headers: httpHeaders,
      withCredentials: true
    });

  }

  getTemplateData<T>(reqParams: root.branch.IApiConfig): Observable<T> {

    // /let currentUser: root.branch.IUser = <root.branch.IUser>this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER);

    let headers: any = {}

    headers = {
      'Accept': 'application/json, text/plain, */*',
      //  'X-Forwarded-For': this.getClientIp(),
      // 'Authorization': 'Bearer ' + currentUser.token,
      //'X-TraceId': this.getTraceId(),
      // 'X-Feature-Flags': 'smsEnabled=true,notificationEnabled=true',
    }

    if (reqParams.headers) {
      for (let headerKey in reqParams.headers) {
        headers[headerKey] = reqParams.headers[headerKey];
      }
    }

    let httpHeaders = new HttpHeaders(headers);

    return this._http.get<T>(this.constructUrl(reqParams), {
      headers: httpHeaders
    });

  }

  postUploadData<T>(reqParams: root.branch.IApiConfig): Observable<T> {
    let headers = {};

    let currentUser: root.branch.IUser;

    // if (this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER)) {
    //   currentUser = <root.branch.IUser>this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER);

    //   headers = {
    //     'Authorization': 'Bearer  ' + currentUser.token,
    //   }
    // }

    if (reqParams.headers) {
      // for (let headerKey in reqParams.headers) {
      //   headers[headerKey] = reqParams.headers[headerKey];
      // }
    }

    let httpHeaders = new HttpHeaders(headers);

    return this._http.post<T>(this.constructUrl(reqParams), reqParams.data, {
      headers: httpHeaders
    });

  }

  postData<T>(reqParams: root.branch.IApiConfig): Observable<T> {

    let headers = {};

    let currentUser: root.branch.IUser;

    // if (this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER)) {
    //   currentUser = <root.branch.IUser>this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER);

    //   headers = {
    //     'Content-Type': 'application/json;',
    //     //'Accept': 'application/json, text/plain, */*',
    //     //'X-Forwarded-For': this.getClientIp(),
    //     'Authorization': 'Bearer  ' + currentUser.token,
    //     //'X-TraceId': this.getTraceId(),
    //     //'X-Feature-Flags': 'smsEnabled=true,notificationEnabled=true',
    //   }

    // }

    if (reqParams.headers) {
      // for (let headerKey in reqParams.headers) {
      //   headers[headerKey] = reqParams.headers[headerKey];
      // }
    }

    let httpHeaders = new HttpHeaders(headers);

    return this._http.post<T>(this.constructUrl(reqParams), reqParams.data, {
      headers: httpHeaders
    });

  }
  postDataWithFile<T>(reqParams: root.branch.IApiConfig): Observable<T> {

    let headers: any = {}
    headers = {
      'Accept': 'application/json, text/plain, */*'
    }
    if (reqParams.headers) {
      for (let headerKey in reqParams.headers) {
        headers[headerKey] = reqParams.headers[headerKey];
      }
    }
    let httpHeaders = new HttpHeaders(headers);
    return this._http.post<T>(this.constructUrl(reqParams), reqParams.formData, {
      headers: httpHeaders,
    });
  }
}
