import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { PersistenceService } from '../../../common/services/persistence.service';
import { SessionService } from '../../../common/services/session.service';
import { SurpriseCashService } from '../../../common/services/surprise-cash.service';
import { AuthenticationService } from '../../../common/services/auth/authentication.service';
import { LocalStorageVariable } from '../../../common/enum/common';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppConfigServiceService } from '../../../common/services/app-config-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private _persistanceService: PersistenceService, private http: HttpClient, private notifier: ToastrService,
    private loginservice: AuthenticationService, private surprisecash: SurpriseCashService, private sessionService: SessionService, private configService: AppConfigServiceService) { }

  accountOpenerName = ''
  accountOpenerEmpId = ''

  ngOnInit(): void {
    this.getUserInfoByPfNo();
  }

  getUserInfoByPfNo() {
    //let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    //let current = this.loginservice.encryptstring(currentUser)
    let current = this.loginservice.encryptstring(this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER_LOGIN)));

    this.surprisecash.getUserDataBypf(current).subscribe((response: any) => {
      if (response.status == 'success') {
        let responseData = JSON.parse(this.loginservice.decryptData(response.rData))
        let decryptData = responseData.StaffDetails;
        this.accountOpenerName = decryptData.EMP_NAME
        this.accountOpenerEmpId = this.loginservice.decryptData(decryptData.EMP_ID)
      }
    })
  }
  logoutUser() {
    this.loginservice.logOut();
    this.sessionService.clearSession();
    sessionStorage.clear();
    this.notifier.success("Logout Successfull");

    this.loginservice.logout(this.accountOpenerEmpId).subscribe((response: any) => {
      if (response.status == 'success') {
        // console.log("header logout respone:", response)
      }
      else {
        // console.log("header logout error:", response);
      }
    });
  }
}
