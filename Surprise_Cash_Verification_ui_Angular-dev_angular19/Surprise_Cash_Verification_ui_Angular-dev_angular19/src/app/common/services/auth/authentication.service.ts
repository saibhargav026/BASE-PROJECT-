import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { PersistenceService } from "../persistence.service";
import { LocalStorageVariable } from "../../../common/enum/common";
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { AppConfigServiceService } from '../app-config-service.service';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private _apiService: ApiService,
    private persistance: PersistenceService, private appConfigService: AppConfigServiceService) { }

  authenticate(req: any): Observable<any> {
    let url = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //url = environment.config.baseUrl + "Account/validateDomainUser"
    url = this.appConfigService.getConfig('baseUrl') + "Account/validateDomainUser"
    return this.httpClient
      .post<any>(url, req, { headers, withCredentials: true })
      .pipe(
        map((userData: any) => {

          //var rDatadecrypt = JSON.parse(this.decryptData(userData.rData))
          //var rDatadecrypt = userData.rData;
          if (userData.status == 'success') {
            if (userData.rData) {
              this.persistance.setSessionStorage(LocalStorageVariable.CURRENT_USER_LOGIN, userData.rData);
            }
          }
          return userData;
        })
      )
  }

  isUserLoggedIn() {
    // let userDetails = sessionStorage.getItem(LocalStorageVariable.CURRENT_USER);
    let userDetails = sessionStorage.getItem(LocalStorageVariable.CURRENT_USER_LOGIN);

    return !(userDetails === null);
  }

  logOut() {
    sessionStorage.removeItem(LocalStorageVariable.CURRENT_USER);
    //sessionStorage.removeItem("username");
  }

  GetQuestions() {
    return this._apiService.getData<any>({
      url: 'Account/GetQuestions'
    })
  }

  decryptData(ciphertextB64: any) {

    var key1 = "01234567890123456789012345678901";
    let key = CryptoJS.enc.Utf8.parse(key1);
    var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);
    var decrypted = CryptoJS.AES.decrypt(ciphertextB64, key, { iv: iv });
    //var decrypted = ciphertextB64;
    return decrypted.toString(CryptoJS.enc.Utf8);
    //return ciphertextB64;
  }

  encryptstring(ciphertextB64: any) {

    var keydata = "01234567890";
    var data = CryptoJS.AES.encrypt(ciphertextB64, keydata).toString();
    //var data=ciphertextB64;
    return data;
  }
  logout(userId: string): Observable<any> {
    return this._apiService.getData<any>({
      url: 'Account/LogOut?userId=' + userId
    })
  }

  myDairyDecrypt(reqObj: any) {
    return this._apiService.postData<any>({
      url: 'Account/MyDairyDecrypt',
      data: reqObj
    });
  }
}
