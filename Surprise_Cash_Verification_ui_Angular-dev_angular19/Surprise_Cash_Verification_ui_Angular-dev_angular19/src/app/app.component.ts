import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AppConfigServiceService } from './common/services/app-config-service.service';
import { tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { AuthenticationService } from './common/services/auth/authentication.service';
import { ExcelService } from './common/services/excel.service';
import { PersistenceService } from './common/services/persistence.service';
import { StepperService } from './common/services/stepper.service';
import { SurpriseCashService } from './common/services/surprise-cash.service';
import { SessionService } from './common/services/session.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterModule,
    NgxUiLoaderModule,
    RouterOutlet
  ],
  providers: [
    SurpriseCashService,
    AuthenticationService,
    PersistenceService,
    StepperService,
    ExcelService,
    SessionService,
    ToastrService],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }


}
