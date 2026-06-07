import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SurpriseCashService {
  private apiUrl = 'http://localhost:7117/api/';
  private data: any;
  private dataSubject = new Subject<any>();

  constructor(private _apiService: ApiService, private _http: HttpClient, private http: HttpClient) { }

  isNotNullorEmpty(value: any) {
    if (value != null && value !== "") {
      return true;
    }
    return false;
  }

  getUserDataBypf(pfNo: string) {
    return this._apiService.postData<any>({
      url: 'Account/GetStaffDetails?ReqParameter=' + pfNo
    })
  }

  getUserDataAfterLogin(pfNo: string) {
    return this._apiService.postData<any>({
      url: 'Account/GetStaffDetailsAfterLogin?ReqParameter=' + pfNo
    })
  }

  getAnnexureFourUsers() {
    return this._apiService.postData<any>({
      url: 'Account/GetAnnexureFourUsers'
    })
  }

  getBranchByZoneRegion(zone: string, region: string) {
    return this._apiService.postData<any>({
      url: 'Account/GetBranchByZoneRegion?zoneCode=' + zone + '&regionCode=' + region,
      //data: reqObj
    })
  }

  getUnNominatedBranch(financialyear: string, quarter: string, regionCode: string, divisionCode: string) {
    return this._apiService.postData<any>({
      url: 'Account/GetUnNominatedBranches?FinancialYear=' + financialyear + '&Quarter=' + quarter + '&RegionCode=' + regionCode + '&DivisionCode=' + divisionCode
      //data: reqObj
    })
  }

  getAnnexure2Details(status: string, code: string, quater: string, iszone: string, financialYear: string, currentUser: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetApprovedAnnexureTwoDetails?status=' + status + '&code=' + code + '&quater=' + quater + '&iszone=' + iszone + '&financialYear=' + financialYear
        + '&currentUser=' + currentUser
    })
  }

  getAnnexureFiveDetails() {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureFiveDetails'
      //data: reqObj
    })
  }

  getAnnexureFourDetails(status: string, code: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureFourDetails?status=' + status + '&code=' + code
      //data: reqObj
    })
  }


  getAnnexure4Details(status: string, zonecode: string, iszone: string, year: string, quater: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetApprovedAnnexureFourDetails?status=' + status + '&zonecode=' + zonecode + '&iszone=' + iszone + '&year=' + year + '&quater=' + quater
      //data: reqObj
    })
  }

  getBranchBybrCode(brCode: string) {
    return this._apiService.getData<any>({
      url: 'Account/GetBranchByBrCode?brCode=' + brCode,
      //data: reqObj
    })
  }

  getBranchEmpDetailByRegion(reqObj: object) {
    return this._apiService.postData<any>({
      url: 'Account/GetBranchDetailsByRegion',
      data: reqObj
    })
  }

  addAnnexureOneDetails(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddAnnexureOneDetails',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  addAnnexureTwoDetails(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddAnnexureTwoDetails',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  addAnnexureThreeDetails(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddAnnexureThreeDetails',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  addAnnexureFourDetails(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddAnnexureFourDetails',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  addApproved(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddApproved',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  BranchComplied(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddBranchComplied',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  ROComplied(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddROComplied',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  ZOComplied(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddZOComplied',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  COComplied(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddCOComplied',
      data: reqObj
    })
  }
  postData(formdata: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddAnnexureTwoDetails',
      data: formdata
    })
  }
  //   return this.http.post<any>(this.apiUrl + 'SurpriseCashVerification/AddAnnexureTwoDetails', formdata);
  // }

  checkDetailsExist(userid: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetails?ReqParameter=' + userid
    })
  }

  checkAnnexureTwo(userid: string, financialYear: string, quarter: string, regionCode: string, regionName:string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByPFNo?ReqParameter=' + userid + '&financialYear=' + financialYear + '&quarter=' + quarter
        + '&regionCode=' + regionCode  + '&regionName=' + regionName
    })
  }

  checkAnnexureTwoCO(financialYear: string, quarter: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsCO?financialYear=' + financialYear + '&quarter=' + quarter
    })
  }
  checkAnnexureTwoDetailsByRegionCode(regioncode: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByRegionCode?ReqParameter=' + regioncode
    })
  }

  checkAnnexureTwoDetailsByRegionCodeQuater(FinancialYear: string, Quater: string, ZoneCode: string, RegionCode: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByRegionCodeQuater?FinancialYear=' + FinancialYear + '&Quater=' + Quater + '&ZoneCode=' + ZoneCode + '&RegionCode=' + RegionCode
    })
  }

  checkAnnexureTwoDetailsByZoneCode(zonecode: string, Quater: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByZoneCode?ReqParameter=' + zonecode + '&Quater=' + Quater
    })
  }

  checkAnnexureTwoDetailsByCO(zonecode: string, financialYear: string, quarter: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByCO?zonecode=' + zonecode + '&financialYear=' + financialYear + '&quarter=' + quarter
    })
  }

  getAnnexure3Details(status: string, code: string, iszone: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureThreeDetails?status=' + status + '&code=' + code + '&iszone=' + iszone
      //data: reqObj
    })
  }

  checkAnnexureTwoDetailsByBranchCode(createdby: number) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByBranchCode?ReqParameter=' + createdby
    })
  }

  checkAnnexureTwoDetailsByBranchCode1(userid: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureTwoDetailsByBranchCode1?ReqParameter=' + userid
    })
  }

  checkAnnexureOneDetailsByPFno(userid: string, financialYear: string, quarter: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureOneDetailsByPFno?ReqParameter=' + userid + '&financialYear=' + financialYear + '&quarter=' + quarter
    })
  }

  BindRegionDetails(zonecode: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetRegionDetails?zoneCode=' + zonecode
    })
  }

  checkAnnexureOneDetailsBySVBranchCode(svbranchcode: string, Current: string, financialYear: string, quarter: string, regionCode: string) {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetAnnexureOneDetailsBySVBranchCode?ReqParameter=' + svbranchcode + '&Current=' + Current + '&financialYear=' + financialYear + '&quarter=' + quarter
        + '&regionCode=' + regionCode
    })
  }

  getAnnexureOneData(currentYear: string, currentQuarter: string, regionCode: string) {
    return this._apiService.getData<any>({
      url: 'SurpriseCashVerification/GetAllAnnexureOneData?currentYear=' + currentYear + '&currentQuarter=' + currentQuarter + '&regionCode=' + regionCode,
    })
  }

  deleteAnnexureOneData(REF_NO: string, userid: string) {
    return this._apiService.getData<any>({
      url: 'SurpriseCashVerification/DeleteAnnexureOneData?RefNo=' + REF_NO + '&userid=' + userid,
    })
  }

  deleteAnnexureTwoData(REF_NO: string, userid: string) {
    return this._apiService.getData<any>({
      url: 'SurpriseCashVerification/DeleteAnnexureTwoData?RefNo=' + REF_NO + '&userid=' + userid,
    })
  }

  addComment(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/AddComment',
      data: reqObj
      //BusinessProfileNpa', 
    })
  }

  getLatestSurpriseDate(svBranchCode: string) {
    return this._apiService.getData<any>({
      url: 'SurpriseCashVerification/GetLatestSurpriseDate?svBranchCode=' + svBranchCode
    })
  }
  getDenominationsCashDetails(reqObj: any): Observable<any> {
    return this._apiService.postData<any>({
      url: 'SurpriseCashVerification/GetDenominationsCashDetails',
      data: reqObj
    })
  }
  getLogInType(emp_desgn: string) {
    return this._apiService.getData<any>({
      url: 'SurpriseCashVerification/GetLogInType?emp_desgn=' + emp_desgn
    })
  }
  getCOLogIn(location: string, emp_id: string) {
    return this._apiService.getData<any>({
      url: 'SurpriseCashVerification/GetCOLogIn?location=' + location + '&emp_id=' + emp_id,
    })
  }
  sendData(data: any) {
    this.dataSubject.next(data);
  }

  getData(): Observable<any> {
    return this.dataSubject;
  }
}
