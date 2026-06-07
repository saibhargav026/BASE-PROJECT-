import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../common/services/admin.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { AuthenticationService } from '../../../common/services/auth/authentication.service';

@Component({
  selector: 'app-add-admin',
  imports: [CommonModule, ReactiveFormsModule, AdminHeaderComponent, FooterComponent],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent implements OnInit {
  staffTypeList$!: Observable<any[]>;
  staffTypeForm!: FormGroup;
  isCentralOfficer: boolean = false;
  isUserTypeSelected: boolean = false;
  isStaffByEmpId: boolean = false;
  staffList: any[] = [];

  constructor(private fb: FormBuilder, private toasterMessage: ToastrService, private router: Router, private adminService: AdminService,
    private loginservice: AuthenticationService) {
  }
  ngOnInit() {
    this.staffTypeForm = this.fb.group({
      userType: ['', Validators.required],
      employeeId: ['', [
        Validators.required,
        Validators.maxLength(10)
      ]],
      employeeLocationCode: [''],
      employeeLocationDescription: [''],
      employeeDesignationCode: [''],
      employeeDesignationDescription: [''],
      status: ['', Validators.required],
    })

    this.staffTypeList$ = this.adminService.getAllStaffTypes()

  }

  onUserTypeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isUserTypeSelected = true;
    this.isCentralOfficer = (target.value === 'CO');

    if (this.isCentralOfficer) {
      this.staffTypeForm.get('employeeLocationCode')?.setValidators([Validators.required]);
      this.staffTypeForm.get('employeeLocationDescription')?.setValidators([Validators.required]);
      this.staffTypeForm.get('employeeDesignationCode')?.clearValidators();
      this.staffTypeForm.get('employeeDesignationDescription')?.clearValidators();
    }
    else {
      this.staffTypeForm.get('employeeDesignationCode')?.setValidators([Validators.required]);
      this.staffTypeForm.get('employeeDesignationDescription')?.setValidators([Validators.required]);
      this.staffTypeForm.get('employeeLocationCode')?.clearValidators();
      this.staffTypeForm.get('employeeLocationDescription')?.clearValidators();
    }

    [
      'employeeLocationCode',
      'employeeLocationDescription',
      'employeeDesignationCode',
      'employeeDesignationDescription',
      'employeeId',
      'status'
    ].forEach(controlName => {
      const control = this.staffTypeForm.get(controlName);
      control?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      control?.markAsUntouched();
      control?.markAsPristine();
    });
    this.staffTypeForm.patchValue({
      employeeId: '',
      employeeDesignationCode: '',
      employeeDesignationDescription: '',
      employeeLocationCode: '',
      employeeLocationDescription: '',
      status: ''
    }, { emitEvent: false });
    this.isStaffByEmpId = false;
  }
  onViewClick() {
    var empId = this.loginservice.encryptstring(this.staffTypeForm.get('employeeId')?.value);
    this.adminService.getStaffByEmpId(empId).subscribe((response: any) => {
      if (response.status == 'success') {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData));
        console.log(decryptData)
        this.isStaffByEmpId = true;
        this.staffTypeForm.controls['employeeLocationCode'].setValue(decryptData.LOCATION);
        this.staffTypeForm.controls['employeeLocationDescription'].setValue(decryptData.LOCATION_DESC);
        this.staffTypeForm.controls['employeeDesignationCode'].setValue(decryptData.EMP_DESGN);
        this.staffTypeForm.controls['employeeDesignationDescription'].setValue(decryptData.EMP_DESGN_DESC);

        this.staffList = [decryptData];
      }
      else {
        this.toasterMessage.error(response.message);
      }
    });
  }
  onSubmitClick() {
    if (this.staffTypeForm.valid) {
      const data = this.staffTypeForm.value;
      this.adminService.addStaff(data).subscribe((response: any) => {
        if (response.status == 'success') {
          this.router.navigateByUrl('/admin-list');
          this.toasterMessage.success(response.message);
        }
        else {
          this.toasterMessage.error(response.message);
        }
      })
    }
    else {
      this.staffTypeForm.markAllAsTouched();
    }
  }

  onGoBackClick() {
    this.router.navigateByUrl('/admin-list')
  }
}
