import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _apiService: ApiService) { }

  getAllLoginList(pageNumber?: number, pageSize?: number) {
    return this._apiService.getData<any>({
      url: 'Admin/GetAllLoginTypes?pageNumber=' + pageNumber + '&pageSize=' + pageSize
    })
  }
  getEmployeeById(id: string) {
    return this._apiService.getData<any>({
      url: 'Admin/GetEmployeeById/' + id
    })
  }
  //http://localhost:7117/api/Admin/UpdateEmployee/1?encryptedRequest=Not_Allow
  updateEmployee(id?: number, encryptedRequest?: string) {
    return this._apiService.getData<any>({
      url: 'Admin/UpdateEmployee/' + id + '?encryptedRequest=' + encryptedRequest
    })
  }
  getAllStaffTypes() {
    return this._apiService.getData<any>({
      url: 'Admin/GetAllStaffTypes',
    })
  }
  getStaffByEmpId(empId: string) {
    return this._apiService.getData<any>({
      url: 'Admin/GetStaffByEmpId?empId=' + empId
    })
  }
  getAllLoginTypeCount() {
    return this._apiService.getData<any>({
      url: 'Admin/GetAllLoginTypeCount',
    })
  }
  addStaff(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'Admin/AddStaff',
      data: reqObj
    })
  }
}
