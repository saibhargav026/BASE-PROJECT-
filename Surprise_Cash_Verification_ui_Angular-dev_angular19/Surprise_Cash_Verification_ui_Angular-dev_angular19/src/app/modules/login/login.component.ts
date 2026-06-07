import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { NgxCaptchaService } from '@binssoft/ngx-captcha'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../common/services/auth/authentication.service';
import { PersistenceService } from '../../common/services/persistence.service';
import { SwalMasterService } from '../../common/services/swal-master.service';
import { LocalStorageVariable } from '../../common/enum/common';
import { SessionService } from '../../common/services/session.service';
import Swal from 'sweetalert2';
import { AppConfigServiceService } from '../../common/services/app-config-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  question: number = 0;
  capthastatus: any;
  captchaStatus: any = null;
  adminUserName: any;
  info: any;
  decryptedText: any;
  encryptedText: any;
  captchaConfig: any = {
    length: 6,
    cssClass: 'data-container',
    back: {
      stroke: "#2F9688",
      solid: "#f2efd2"
    },
    font: {
      color: "#000000",
      size: "50px"
    },
    width: {
      width: "400px"
    }
  };

  fromGroup_Obj_login!: FormGroup;

  constructor(private _route: Router,
    private loginservice: AuthenticationService,
    private _persistanceService: PersistenceService,
    private notifier: ToastrService,
    private fb: FormBuilder,
    private swal: SwalMasterService,
    // private captchaService: NgxCaptchaService,
    private persistance: PersistenceService,
    private sessionService: SessionService,
    private appConfigService: AppConfigServiceService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    // console.log("Data Source=172.27.206.146:1525/ORCL19;Persist Security Info=True; User ID=SURPRISE_CASH_VERIFICATION; Password=AAssddff##12345");
    // console.log(this.loginservice.encryptstring("Data Source=172.27.206.146:1525/ORCL19;Persist Security Info=True; User ID=SURPRISE_CASH_VERIFICATION; Password=AAssddff##12345"));
    sessionStorage.removeItem("currentUser");
    this.fromGroup_Obj_login = this.fb.group({
      username: ['', [Validators.required]],
      parameter2: ['', [Validators.required]],
      'confirmCaptcha': new FormControl(null, [Validators.required]),
      //,captcha : ['',[Validators.required]]
    });


    this.route.queryParams.subscribe((params: any) => {
      this.encryptedText = params['data'];
      console.log('Encrypted Text from URL:',  this.encryptedText);

      const reqObj = { encryptedText: this.encryptedText };
      if (this.encryptedText) {
        this.loginservice.myDairyDecrypt(reqObj).subscribe({
          next: (res: any) => {
            this.decryptedText = res.decryptedText;
            console.log("Decrypted Response:", this.decryptedText);

            if (this.decryptedText) {
              const parts = this.decryptedText.split('|');
              if (parts.length >= 2) {
                const userId = parts[0];
                const ps = parts[1];

                const req = {
                  user_id: this.loginservice.encryptstring(userId),
                  ps: this.loginservice.encryptstring(ps)
                };

                this.AuthenticationCheck(req);
              } else {
                console.error("Invalid decrypted text format:", this.decryptedText);
              }
            }
          },
          error: (err: any) => {
            console.error("API error:", err);
          }
        });
      }
      else {
        this.GetQuestions();
        this._route.navigate(['/']);
      }
    });
  }

  GetQuestions() {

    this.loginservice.GetQuestions().subscribe((response: any) => {
      if (response.status == 'success') {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData));
        this.question = decryptData.Question;
      }
    })
  }



  checkLogin() {

    if (this.fromGroup_Obj_login.value.confirmCaptcha == null || this.fromGroup_Obj_login.value.confirmCaptcha == undefined) {
      this.swal.showMessage('Please Enter Captcha', 'error');
      return;
    }
    // else if(this.fromGroup_Obj_login.value.confirmCaptcha.length > 0) {
    //   const ans = this.question2+this.question1;
    //   if(this.fromGroup_Obj_login.value.confirmCaptcha != ans) {
    //     this.swal.showMessage('Enter Correct Captcha', 'error');
    //     this.checkcaptha();
    //     return;
    //   }
    // }
    // else {
    //   this.swal.showMessage('Enter Correct Captcha', 'error');
    //   this.checkcaptha();
    //   return;
    // }
    if (this.fromGroup_Obj_login.invalid) {
      this.notifier.error('Error', 'Please retry with valid inputs');
      return;
    }
    this.adminUserName = this.loginservice.decryptData(this.appConfigService.getConfig('userName'));
    this.info = this.loginservice.decryptData(this.appConfigService.getConfig('data'));
    if (this.fromGroup_Obj_login.get('username')?.value === this.adminUserName && this.fromGroup_Obj_login.get('parameter2')?.value === this.info) {
      const req = {
        'user_id': this.loginservice.encryptstring(this.adminUserName),
        'ps': this.loginservice.encryptstring(this.info),
        'captcha': this.loginservice.encryptstring(this.fromGroup_Obj_login.get('confirmCaptcha')?.value)
      };
      this.AuthenticationCheck(req);
    }
    else {
      const req = {
        'user_id': this.loginservice.encryptstring(this.fromGroup_Obj_login.get('username')?.value),
        'ps': this.loginservice.encryptstring(this.fromGroup_Obj_login.get('parameter2')?.value),
        'captcha': this.loginservice.encryptstring(this.fromGroup_Obj_login.get('confirmCaptcha')?.value)
      };

      this.AuthenticationCheck(req);
    }
  }

  ShowConfirmationToast() {
    Swal.fire({
      title: 'Warning!',
      text: 'User already logged In. Click on ' + "OK" + ' to clear the previous session to login here.',
      icon: 'warning',
      confirmButtonText: 'OK',
      showCancelButton: false,
      cancelButtonText: 'Cancel',

    }).then((res: any) => {
      if (res.isConfirmed) {
        this.loginservice.logout(this.fromGroup_Obj_login.get('username')?.value).subscribe((response: any) => {
        });
      }
    }

    )
  }
  AuthenticationCheck(req: any) {
    this.loginservice.authenticate(req).subscribe(
      (data: any) => {
        if (data.status == 'success') {

          var rDatadecrypt = JSON.parse(this.loginservice.decryptData(data.rData))
          //var rDatadecrypt = data.rData;
          //let currentUser: root.branch.userData = <root.branch.userData>this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER);
          //  this.notifier.success("Login In Successfull",'Success')
          // this._route.navigate(['annexure']);
          if (rDatadecrypt.User.validation_status == "true") {
            let currentUser: root.branch.userData = <root.branch.userData>this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER);
            this.sessionService.setSessionId();
            sessionStorage.setItem('Token', rDatadecrypt.token)
            this.notifier.success("Login In Successfull")
            if (rDatadecrypt['User']['user_id'] == this.adminUserName && this.fromGroup_Obj_login.get('parameter2')?.value === this.info) {
              this._route.navigate(['/admin-navbar']);
            }
            else {
              this._route.navigate(['annexure']);
            }
          }
        }
        else if (data.status == 'error' && data.message == "Please Clear previous Session then try to login again") {
          this.ShowConfirmationToast();
        }
        else {
          this.notifier.error(data.message)
          this.GetQuestions();
          //this.swal.showMessage(data.message, 'error')
        }

      },
      (error: any) => {
        this.notifier.error("Login Failed")
        this.GetQuestions();
        //this.swal.showMessage("Login Failed", 'error')
      }
    );
  }
}
