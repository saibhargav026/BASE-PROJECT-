import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../common/services/admin.service';
import { FooterComponent } from '../../common/footer/footer.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../common/services/auth/authentication.service';

@Component({
  selector: 'app-edit-admin',
  imports: [ReactiveFormsModule, CommonModule, AdminHeaderComponent, FooterComponent],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css'
})
export class EditAdminComponent implements OnInit {

  staffTypeForm!: FormGroup;
  id: any

  staffTypeList$!: Observable<any[]>;
  isCentralOfficer: boolean = false;
  isUserTypeSelected: boolean = false;
  isStaffByEmpId: boolean = false;
  staffList: any[] = [];
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private adminService: AdminService, private toasterMessage: ToastrService, private router: Router,
    private loginservice: AuthenticationService) {

  }
  ngOnInit() {
    this.staffTypeForm = this.fb.group({
      userType: ['', Validators.required],
      id: ['', Validators.required],
      employeeId: [''],
      employeeLocationCode: [''],
      employeeLocationDescription: [''],
      employeeDesignationCode: [''],
      employeeDesignationDescription: ['', Validators.required],
      status: ['', Validators.required],
    })

    this.staffTypeList$ = this.adminService.getAllStaffTypes()
    this.route.paramMap.subscribe({
      next: (response: any) => {
        this.id = response.get('id')
      }
    });
    if (this.id) {
      this.staffTypeForm.disable();
      this.staffTypeForm.get('status')?.enable();
      this.adminService.getEmployeeById(this.id).subscribe((response: any) => {
        if (response.status == 'success') {
          console.log(response)
          this.staffTypeForm.controls['userType'].setValue(response.rData.useR_TYPE);
          this.staffTypeForm.controls['id'].setValue(response.rData.id);
          this.staffTypeForm.controls['employeeId'].setValue(response.rData.emP_ID);
          this.staffTypeForm.controls['employeeLocationCode'].setValue(response.rData.location);
          this.staffTypeForm.controls['employeeLocationDescription'].setValue(response.rData.locatioN_DESC);
          this.staffTypeForm.controls['employeeDesignationCode'].setValue(response.rData.emP_DESGN);
          this.staffTypeForm.controls['employeeDesignationDescription'].setValue(response.rData.emP_DESGN_DESC);
          this.staffTypeForm.controls['status'].setValue(response.rData.status);
        }
        else {
          this.toasterMessage.error(response.message);
        }
      })
    }
  }

  onCancelClick() {
    this.router.navigateByUrl('/admin-list')
  }

  UpdateEmployee() {
    const status = this.staffTypeForm.get('status')?.value;
    this.adminService.updateEmployee(this.id, status).subscribe((response: any) => {
      if (response.status == 'success') {
        console.log(response)
        this.router.navigateByUrl('/admin-list');
        this.toasterMessage.success(response.message);
      }
      else {
        this.toasterMessage.error(response.message);
      }
    })

  }
}
