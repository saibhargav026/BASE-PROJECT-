import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersistenceService } from '../../common/services/persistence.service';
import { AuthenticationService } from '../../common/services/auth/authentication.service';
import { SurpriseCashService } from '../../common/services/surprise-cash.service';
import { LocalStorageVariable } from '../../common/enum/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dialog-popup',
  standalone: true,
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class DialogPopupComponent implements OnInit {


  @Output() closed = new EventEmitter<void>();
  data: any;
  commentForm !: FormGroup
  receivedData: any;
  isVisible: boolean = true;
  @Output() updateButtons = new EventEmitter<{ showApproved: boolean, showRejected: boolean }>();

  constructor(private surprisecash: SurpriseCashService, private notifier: ToastrService, private _persistanceService: PersistenceService, private fb: FormBuilder, private loginservice: AuthenticationService) { }

  ngOnInit(): void {
    debugger;
    this.surprisecash.getData().subscribe((data: any) => {
      this.receivedData = data;
    });

    this.commentForm = this.fb.group({
      Comment: ['', Validators.required]
    });
  }

  closepopup(): void {
    this.closed.emit;
    this.isVisible = false;
  }

  Submit(stepper: any) {
    if (this.commentForm.valid) {
      debugger;
      // let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let currentUser = this.loginservice.encryptstring(this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER)));

      let ModifiedBy = currentUser;
      var Status = "Rejected";
      var reqObj = this.commentForm.value
      const SVBranchCode = this._persistanceService.getSessionStorage('branch_code');
      const RefNo = this._persistanceService.getSessionStorage('ref_no');

      const postData = { ...reqObj, Status, ModifiedBy, SVBranchCode: SVBranchCode.data, RefNo }
      this.surprisecash.addComment(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.isVisible = false;
          //just emit to parent
          this.updateButtons.emit({ showApproved: false, showRejected: false });
          this.notifier.success(response.message);
          window.location.reload();
          // stepper.next();
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.commentForm.markAllAsTouched();
    }
  }
}
