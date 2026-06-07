import { Component, OnInit } from '@angular/core';
import { AppConfigServiceService } from '../../../common/services/app-config-service.service';
import { AuthenticationService } from '../../../common/services/auth/authentication.service';
import { SessionService } from '../../../common/services/session.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent implements OnInit {

  accountOpenerName: any;
  constructor(private appConfigService: AppConfigServiceService, private loginservice: AuthenticationService,
    private sessionService: SessionService,
    private toasterService: ToastrService) {

  }
  ngOnInit(): void {
    this.accountOpenerName = this.loginservice.decryptData(this.appConfigService.getConfig('userName'));
  }

  logoutUser() {
    this.loginservice.logOut();
    this.sessionService.clearSession();
    sessionStorage.clear();
    this.toasterService.success("Logout Successfull")
    this.loginservice.logout(this.accountOpenerName).subscribe((response: any) => {
      if (response.status == 'success') {
        // console.log("header logout respone:", response)
      }
      else {
        // console.log("header logout error:", response);
      }
    });
  }
}
