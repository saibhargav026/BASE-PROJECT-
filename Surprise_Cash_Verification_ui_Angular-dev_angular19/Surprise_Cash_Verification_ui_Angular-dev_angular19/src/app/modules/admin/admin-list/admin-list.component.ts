import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../common/services/admin.service';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FooterComponent } from '../../common/footer/footer.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-list',
  imports: [CommonModule, RouterModule, AdminHeaderComponent, FooterComponent],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent implements OnInit {
  loginTypeLists$!: Observable<any[]>;
  loginTypeList!: any[];
  pageNumber: number = 1;
  pageSize: number = 10;
  list: number[] = [];
  totalCount!: number;

  constructor(private adminService: AdminService) {

  }
  ngOnInit() {
    this.adminService.getAllLoginTypeCount().subscribe(
      (response: any) => {
        this.totalCount = response;
        this.list = new Array(Math.ceil(response / this.pageSize))
      })
    this.loginTypeLists$ = this.adminService.getAllLoginList(this.pageNumber, this.pageSize);
    //  .subscribe(
    //    (response: any) => {
    //      this.loginTypeList=response;
    //    })
  }
  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loginTypeLists$ = this.adminService.getAllLoginList(this.pageNumber, this.pageSize);
  }
  getPreviousPage() {
    if (this.pageNumber - 1 < 1) {
      return;
    }
    this.pageNumber -= 1;
    this.loginTypeLists$ = this.adminService.getAllLoginList(this.pageNumber, this.pageSize);
  }
  getNextPage() {
    if (this.pageNumber + 1 > this.list.length) {
      return;
    }
    this.pageNumber += 1;
    this.loginTypeLists$ = this.adminService.getAllLoginList(this.pageNumber, this.pageSize);
  }

}