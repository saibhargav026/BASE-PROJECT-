import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalMasterService {

  constructor() { }

  showMessage(title: string, type: any) {
    Swal.fire({
      title: title,
      icon: type,
      // showCancelButton: false,
      showConfirmButton: false,
      timer: 10000
    })
  }
  showWarning(title: string, type: any): Promise<any> {
    return Swal.fire({
      title: title,
      icon: type,
      showCancelButton: true,
      confirmButtonText: "Yes"
    })
  }
}
