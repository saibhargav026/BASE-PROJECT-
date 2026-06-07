import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogPopupComponent } from '../dialog-popup/dialog-popup.component';
import { ToWords } from 'to-words';
import { __values } from 'tslib';
import { SurpriseCashService } from '../../common/services/surprise-cash.service';
import { PersistenceService } from '../../common/services/persistence.service';
import { StepperService } from '../../common/services/stepper.service';
import { ExcelService } from '../../common/services/excel.service';
import { AuthenticationService } from '../../common/services/auth/authentication.service';
import { LocalStorageVariable } from '../../common/enum/common';
import { Branch } from '../../common/models/branch';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../common/header/header.component';
import { FooterComponent } from '../common/footer/footer.component';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../common/services/session.service';

@Component({
  selector: 'app-surprise-cash',
  standalone: true,
  templateUrl: './surprise-cash.component.html',
  styleUrls: ['./surprise-cash.component.css'],
  imports: [HeaderComponent, MatStepperModule, BrowserModule, CommonModule, ReactiveFormsModule, DialogPopupComponent, FooterComponent]
})

export class SurpriseCashComponent implements OnInit {

  constructor(private resolver: ComponentFactoryResolver, private route: ActivatedRoute, private _route: Router, private _persistanceService: PersistenceService, private fb: FormBuilder, private notifier: ToastrService, private http: HttpClient, private sessionService: SessionService,
    private loginservice: AuthenticationService, private surprisecash: SurpriseCashService, private stepperService: StepperService, private excelService: ExcelService) {
    this.stepper = {} as MatStepper;
    this.stepperService.stepChange$.subscribe((index: any) => {
      this.stepper.selectedIndex = index;
    })
  }
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('formRef', { static: false }) formRef!: ElementRef;
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  dynamicRef!: ComponentRef<DialogPopupComponent>;
  BRQuater: string[] = [];
  BRFinancialYear: string[] = [];
  annexureOneForm !: FormGroup
  annexureTwoForm !: FormGroup
  cashDenominationForm !: FormGroup
  annexureThreeForm !: FormGroup
  annexureFiveForm !: FormGroup
  annexureSevenForm !: FormGroup
  annexureFourForm !: FormGroup
  branches!: Branch[];
  filteredbranches: any[][] = [];
  allBranches: any[] = [];
  Branches: any[] = [];
  BranchesEmpdetail: any[][] = [];
  selectedValue: any;
  formSubmitted = false;
  detailsExist = false;
  showbutton: boolean = true;
  submitButtonAnnexure1: boolean = true;
  data!: any[];
  showForm: boolean = false;
  ShowingNoV1: boolean = false;
  ShowingNoV2: boolean = false;
  ShowingNoV3: boolean = false;
  ShowingNoV3Date: boolean = false;
  ShowingNoV2Date: boolean = false;
  ShowingNoV4: boolean = false;
  ShowingNoVI: boolean = false;
  ShowingNoVII1: boolean = false;
  ShowingNoVII2: boolean = false;
  ShowingNoVIII1: boolean = false;
  ShowingNoVIII2: boolean = false;
  ShowingNoVIII3: boolean = false;
  ShowingNoIX1: boolean = false;
  ShowingNoIX2: boolean = false;
  ShowingNoXI: boolean = false;
  ShowingNoXII1: boolean = false;
  ShowingNoXII1Date: boolean = false;
  ShowingNoXII2: boolean = false;
  ShowingNoXII2Date: boolean = false;
  ShowingNo121: boolean = false;
  ShowingNo161: boolean = false;
  ShowingNo171: boolean = false;
  ShowingNo181: boolean = false;
  ShowZoneDDL: boolean = true;
  ShowRegionDDL: boolean = true;
  ShowRegionDropDown: boolean = false;
  BranchCompliedButton: boolean = true;
  BranchNotCompliedButton: boolean = true;
  ROCompliedButton: boolean = true;
  RONotCompliedButton: boolean = true;
  ZOCompliedButton: boolean = true;
  COCompliedButton: boolean = true;
  ZONotCompliedButton: boolean = true;
  buttonText: string = 'View';
  buttonTextDelete: string = 'Delete';
  ApplicationDate!: string;
  showPrintButton: boolean = false;
  labelName: string = 'Not submitted';
  paramName!: string;
  showApprovedbutton: boolean = false;
  showRejectbutton: boolean = false;
  showResetButton: boolean = false;
  showComment: boolean = false;
  showPopup!: boolean;
  showTable: boolean = false;
  ShowBranchAction: boolean = false;
  ShowROAction: boolean = false;
  ShowZOAction: boolean = false;
  ShowCOAction: boolean = false;
  showAnnexure2details: boolean = false;
  showAnnexure1details: boolean = false;
  showAnnexureCOdetails: boolean = false;
  ShowRegionWise: boolean = false;
  ShowBranchWise: boolean = false;
  annexureTwodata!: any[];
  annexureTwodataFive!: any[];
  AnnexureOneAlldata!: any[];
  BranchData!: any[];
  annexureTwodataGrid!: any[];
  annexureTwodataGridCO!: any[];
  annexureThreedata!: any[];
  annexureFivedata!: any[];
  annexureFourdata!: any[];
  annexureTwoBranchdata!: any[];
  showModal: boolean = true;
  showAnnexure3Form: boolean = false;
  showAnnexure4Form: boolean = false;
  showAnnexure5Form: boolean = false;
  showAnnexure6Form: boolean = false;
  showAnnexure7Form: boolean = false;
  showAnnexure1Form: boolean = false;
  showAnnexure2Form: boolean = false;
  ShowAnnexure1Button: boolean = false;
  ShowAnnexure2Button: boolean = false;
  ShowAnnexure3Button: boolean = false;
  ShowAnnexure4Button: boolean = false;
  ShowAnnexure5Button: boolean = false;
  ShowAnnexure6Button: boolean = false;
  ShowAnnexure7Button: boolean = false;
  ShowAnnexureDeleteButton: boolean = false;
  showAnnexureOneTwoButton: boolean = false;
  showAnnexureFourFiveButton: boolean = false;
  showAnnexureOneButton: boolean = false;
  ShowZoneDropDown: boolean = false;
  ShowDiscrepanciesThreeForm: boolean = false;
  ShowDiscrepanciesFourForm: boolean = false;
  ShowDDLRegion: boolean = false;
  MONTHLY_CASH_VERIFICATION_OF_CASH_YES: string = '';
  MONTHLY_CASH_VERIFICATION_OF_CASH_NO: string = '';
  MONTHLY_CASH_VERIFICATION_OF_CASH_NOT_TALLIED: string = '';
  PERIODICAL_SURPRISE_CHECK_YES: string = '';
  PERIODICAL_SURPRISE_CHECK_NO: string = '';
  PERIODICAL_SURPRISE_CHECK_NOT_TALLIED: string = '';
  KEPT_UNDER_JOINT_CUSTODY_YES: string = '';
  KEPT_UNDER_JOINT_CUSTODY_NO: string = '';
  KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED: string = '';
  JOINT_CUSTODIAN_VERIFYING_YES: string = '';
  JOINT_CUSTODIAN_VERIFYING_NO: string = '';
  JOINT_CUSTODIAN_VERIFYING_NOT_TALLIED: string = '';
  OTHER_GUIDELINES_COMPILED_YES: string = '';
  OTHER_GUIDELINES_COMPILED_NO: string = '';
  OTHER_GUIDELINES_COMPILED_NOT_TALLIED: string = '';
  KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES: string = '';
  KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO: string = '';
  KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED: string = '';
  KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES: string = '';
  KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO: string = '';
  KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NOT_TALLIED: string = '';
  KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES: string = '';
  KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO: string = '';
  KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NOT_TALLIED: string = '';
  SAFE_CUSTODY_RECEIPT_YES: string = '';
  SAFE_CUSTODY_RECEIPT_NO: string = '';
  SAFE_CUSTODY_RECEIPT_NOT_TALLIED: string = '';
  STAMPED_AGREEMENT_FORMS_YES: string = '';
  STAMPED_AGREEMENT_FORMS_NO: string = '';
  STAMPED_AGREEMENT_FORMS_NOT_TALLIED: string = '';
  NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES: string = '';
  NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO: string = '';
  NO_OF_POST_PARCELS_HELD_BY_BRANCH_NOT_TALLIED: string = '';
  POSTAL_STAMPS_YES: string = '';
  POSTAL_STAMPS_NO: string = '';
  POSTAL_STAMPS_NOT_TALLIED: string = '';
  KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES: string = '';
  KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO: string = '';
  KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NOT_TALLIED: string = '';
  SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES: string = '';
  SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO: string = '';
  SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NOT_TALLIED: string = '';
  SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES: string = '';
  SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO: string = '';
  SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NOT_TALLIED: string = '';
  SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES: string = '';
  SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO: string = '';
  SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NOT_TALLIED: string = '';
  WHETHER_ULTRAVIOLET_LAMP_WORKING_YES: string = '';
  WHETHER_ULTRAVIOLET_LAMP_WORKING_NO: string = '';
  WHETHER_ULTRAVIOLET_LAMP_WORKING_NOT_TALLIED: string = '';
  CCTV_SYSTEM_IS_WORKING_YES: string = '';
  CCTV_SYSTEM_IS_WORKING_NO: string = '';
  CCTV_SYSTEM_IS_WORKING_NOT_TALLIED: string = '';
  CASH_COUNTING_MACHINE_WORKING_YES: string = '';
  CASH_COUNTING_MACHINE_WORKING_NO: string = '';
  CASH_COUNTING_MACHINE_WORKING_NOT_TALLIED: string = '';
  NOTE_SORTING_MACHINE_WORKING_YES: string = '';
  NOTE_SORTING_MACHINE_WORKING_NO: string = '';
  NOTE_SORTING_MACHINE_WORKING_NOT_TALLIED: string = '';
  WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES: string = '';
  WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO: string = '';
  WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NOT_TALLIED: string = '';
  PHYSICAL_CASH_IN_ATM_VERIFIED_YES: string = '';
  PHYSICAL_CASH_IN_ATM_VERIFIED_NO: string = '';
  PHYSICAL_CASH_IN_ATM_VERIFIED_NOT_TALLIED: string = '';
  WHETHERMACHINESORTEDNOTESYES: string = '';
  WHETHERMACHINESORTEDNOTESNO: string = '';
  WHETHERMACHINESORTEDNOTESNOTTALLIED: string = '';
  WHETHERAVAITABITITYOFNAMYES: string = '';
  WHETHERAVAITABITITYOFNAMNO: string = '';
  WHETHERAVAITABITITYOFNAMNOTTALLIED: string = '';
  WHETHERFIRYES: string = '';
  WHETHERFIRNO: string = '';
  WHETHERFIRNOTTALLIED: string = '';
  MONTHTYCONSOTIDATEDREPORTYES: string = '';
  MONTHTYCONSOTIDATEDREPORTNO: string = '';
  MONTHTYCONSOTIDATEDREPORTNOTTALLIED: string = '';


  Total2000Amount: number = 0;
  Total500Amount: number = 0;
  Total200Amount: number = 0;
  Total100Amount: number = 0;
  Total50Amount: number = 0;
  Total20Amount: number = 0;
  Total10Amount: number = 0;
  Total5Amount: number = 0;
  Total2Amount: number = 0;
  Total1Amount: number = 0;
  Total20AmountCoins: number = 0;
  Total10AmountCoins: number = 0;
  Total5AmountCoins: number = 0;
  Total2AmountCoins: number = 0;
  Total1AmountCoins: number = 0;
  Total50PaisaAmountCoins: number = 0;
  TotalSum: number = 0;
  amountToWords!: string;

  FinancialYearFive!: any;
  QuaterFive!: any;
  ZoneFive!: any;
  RegionFive!: any;

  showDescDiv: boolean = false;

  selectedQuarter = new FormControl('');

  quarters = [
    { id: 'Q1', name: 'Quarter 1' },
    { id: 'Q2', name: 'Quarter 2' },
    { id: 'Q3', name: 'Quarter 3' },
    { id: 'Q4', name: 'Quarter 4' },
  ]

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  currentQuarter: number = Math.floor(this.currentMonth / 3) + 1;

  financialYears: string[] = [];
  currentFinancialYear!: string;
  FinancialYear: string = '';
  FullYear: string = '';
  Quater: string = '';
  selectedYear = new FormControl('');
  annexureTwoNoData: string = '';
  isNext: boolean = false;
  officersIndexNumber: number = 0;
  isFirstOfficer: boolean = true;
  isNotFirstOfficer: boolean = false;
  currentIndex: number = 0;
  generatedRefNos: number[] = [];

  @ViewChild('fyfinancialyear') fyfinancialyear!: ElementRef;
  @ViewChild('fyquarter') fyquarter!: ElementRef;
  @ViewChild('fyfullyear') fyfullyear!: ElementRef;
  today = new Date();
  minDate!: string;
  maxDate!: string;

  ngOnInit() {
    //this.setFinancialYears();
    this.setCurrentFinancialYearAndQuarter();

    // this.selectedYear.setValue(this.financialYears[0]);

    // const currentMonth = new Date().getMonth() + 1;
    // //const currentQuarter = `Q${Math.floor(currentMonth / 3) + 1}`;
    // const currentQuarter = currentMonth >= 4 && currentMonth <= 6 ? 'Q1' :
    // currentMonth >= 7 && currentMonth <= 9 ? 'Q2':
    // currentMonth >= 10 && currentMonth <= 12 ? 'Q3': 'Q4';
    // this.selectedQuarter.setValue(currentQuarter);

    this.getUserInfoByPfNo();

    this.stepperService.stepChange$.subscribe((index: any) => {
      if (this.stepper) {
        this.stepper.selectedIndex = index;
      }
    })
    //this.checkDetailsExixst();

    this.showForm = false;

    this.annexureOneForm = this.fb.group({
      LoggedUserId: [''],
      ZoneCode: [''],
      ZoneName: [''],
      FromDyrhName: [''],
      FromRegionHead: ['', Validators.required],
      FromRegionName: ['', Validators.required],
      RegionCode: [''],
      // SvBranchCode: ['', Validators.required],
      // IoBranchCode: ['', Validators.required],
      // BranchManagerName: ['', Validators.required],
      // BranchEmpId: [''],
      // ToBranchOfficierDesignation: [''],
      // ToBranchOfficierName: [''],
      // ToBranchOfficierBranchName: [''],
      // ToBranchOfficierBranchName1: [''],
      // ApplicationDate: [this.getCurrentDate()],
      // ICNo: ["05056-2024"],
      // ICNoDate: ["2024-08-17"],
      FinancialYear: [''],
      Quater: ['']
      , newBranches: new FormArray([
        new FormGroup({
          SvBranchCode: new FormControl('', Validators.required),
          IoBranchCode: new FormControl('', Validators.required),
          BranchManagerName: new FormControl('', Validators.required),
        })
      ]),
      officers: new FormArray([
        new FormGroup({
          ToBranchOfficierBranchName1: new FormControl(''),
          ToBranchOfficierBranchName: new FormControl(''),
          ToBranchOfficierDesignation: new FormControl(''),
          ToBranchOfficierName: new FormControl(''),
          BranchEmpId: new FormControl(''),
          FromRegionHead: new FormControl('', Validators.required),
          FromRegionName2: new FormControl('', Validators.required),
          ApplicationDate: new FormControl(this.getCurrentDate()),
          ICNo: new FormControl("05056-2024"),
          ICNoDate: new FormControl("2024-08-17"),
          SvBranchCode: new FormControl(''),
          IoBranchCode: new FormControl(''),
        })
      ])
    });

    this.annexureTwoForm = this.fb.group({
      LoggedUserId: [''],
      NameOfInspectingOfficer: ['', Validators.required],
      NameOfBranch: ['', Validators.required],
      DateOfPrevSurpriseVerification: ['', Validators.required],
      DateOfVerification: [this.getCurrentDate()],
      OpeningClosingOfBusiness: ['', Validators.required],
      OpeningClosingOfBusinessAmount: ['', Validators.required],
      SoiledNotesAmt: ['', Validators.required],
      SafeCustodyReceiptDated: ['', Validators.required],
      SafeCustodyReceiptName: ['', Validators.required],
      SafeCustodyReceipt: ['', Validators.required],
      StampedAgreementForms: ['', Validators.required],
      StampedAgreementFormsAmount: ['', Validators.required],
      NoOfPostParcelsHeldByBranch: ['', Validators.required],
      PostParcelsHeldByBranch: ['', Validators.required],
      PostalStamps: ['', Validators.required],
      PostalStampsAmount: ['', Validators.required],
      MonthlyCashVerification: ['', Validators.required],
      PeriodicalSurpriseCheck: ['', Validators.required],
      KeptUnderJointCustody: ['', Validators.required],
      JointCustodianVerifying: ['', Validators.required],
      OtherGuidelinesCompiled: ['', Validators.required],
      KeyRegisterKeptUnderJointCustody: ['', Validators.required],
      KeyRegisterWhetherKeyRegisterMaintained: ['', Validators.required],
      KeyRegisterDuplicateSetOfCashKeys: ['', Validators.required],
      KeyRegisterDuplicateSetOfCashKeysDate: [this.maxDate],
      KeyRegisterMasterKeyOfTheLockers: ['', Validators.required],
      SafetySecurityFoundThatStoringRoomDoorOfBranch: ['', Validators.required],
      SafetySecurityFoundThatDoorOfNetworkRoom: ['', Validators.required],
      SafetySecurityFoundThatBurglaryAlarmSystem: ['', Validators.required],
      WhetherUltravioletLampProvided: ['', Validators.required],
      WhetherUltravioletLampWorking: ['', Validators.required],
      CCTVSystemIsProvided: ['', Validators.required],
      CCTVSystemIsWorking: ['', Validators.required],
      CCTVRecordingOfLast90DaysAvailable: ['', Validators.required],
      CashCountingMachineProvided: ['', Validators.required],
      CashCountingMachineWorking: ['', Validators.required],
      NoteSortingMachineProvided: ['', Validators.required],
      NoteSortingMachineWorking: ['', Validators.required],
      SecurityGuardIsInvolved: ['', Validators.required],
      SecurityGuardIsInvolvedDetails: [''],
      WhetherBranchHasConductedSurpriseCash: ['', Validators.required],
      PhysicalCashInAtmVerified: ['', Validators.required],
      SelectDesc: ['', Validators.required],
      Discrepancies: ['', Validators.required],
      Notes2000: ['', Validators.required],
      Notes500: ['', Validators.required],
      Notes200: ['', Validators.required],
      Notes100: ['', Validators.required],
      Notes50: ['', Validators.required],
      Notes20: ['', Validators.required],
      Notes10: ['', Validators.required],
      Notes5: ['', Validators.required],
      Notes2: ['', Validators.required],
      Notes1: ['', Validators.required],
      Coins20: ['', Validators.required],
      Coins10: ['', Validators.required],
      Coins5: ['', Validators.required],
      Coins2: ['', Validators.required],
      Coins1: ['', Validators.required],
      Coins50Paisa: ['', Validators.required],
      KeyRegisterKeptUnderJointCustodyNo: [''],
      KeyRegisterWhetherKeyRegisterMaintainedNo: [''],
      KeyRegisterDuplicateSetOfCashKeysNo: [''],
      KeyRegisterMasterKeyOfTheLockersNo: [''],
      SafetySecurityFoundThatBurglaryAlarmSystemNo: [''],
      WhetherUltravioletLampProvidedNo: [''],
      WhetherUltravioletLampWorkingNo: [''],
      CCTVSystemIsProvidedNo: [''],
      CCTVSystemIsWorkingNo: [''],
      CCTVRecordingOfLast90DaysAvailableNo: [''],
      CashCountingMachineProvidedNo: [''],
      CashCountingMachineWorkingNo: [''],
      WhetherBranchHasConductedSurpriseCashDate: [this.getCurrentDate()],
      WhetherBranchHasConductedSurpriseCashNo: [''],
      PhysicalCashInAtmVerifiedDate: [this.getCurrentDate()],
      PhysicalCashInAtmVerifiedNo: [''],
      ActionTakenBranchHead: [''],
      ActionTakenROHead: [''],
      ActionTakenZOHead: [''],
      ActionTakenCOHead: [''],
      WhetherMachineSortedNotes: ['', Validators.required],
      WhetherMachineSortedNotesNo: [''],
      WhetherAvaitabitityofNAM: ['', Validators.required],
      WhetherAvaitabitityofNAMNo: [''],
      WhetherFIR: ['', Validators.required],
      WhetherFIRNo: [''],
      MonthlyConsotidatedReport: ['', Validators.required],
      MonthlyConsotidatedReportNo: [''],
      FinancialYearTwo: [''],
      QuaterTwo: [''],
      cashSelectionType: ['']

    });

    this.annexureThreeForm = this.fb.group({
      RegionalHead: [''],
      RegionalOffice: [''],
      ZonalHead: [''],
      ZonalOffice3: [''],
      Date: [this.getCurrentDate()],
      Discrepancies: ['', Validators.required],
      FinancialYearAnnexure3: ['', Validators.required],
      QuaterAnnexure3: ['', Validators.required]
    });

    this.annexureFiveForm = this.fb.group({
      FinancialYearFive: [''],
      QuaterFive: [''],
      ZoneFive: [''],
      RegionFive: ['']
    });

    this.annexureSevenForm = this.fb.group({
      FinancialYearSeven: [''],
      QuaterSeven: ['']
    });

    this.annexureFourForm = this.fb.group({
      ZonalHead4: [''],
      ZonalOffice4: [''],
      OperationDepartment4: ['Operations Department'],
      CentralOfficeAnnex: ['Central Office-Mumbai'],
      Date4: [this.getCurrentDate()],
      Discrepancies4: ['', Validators.required],
      YearFour: [''],
      QuaterFour: ['']
    });

    this.cashDenominationForm = this.fb.group({
      NominatedBranchCode: [''],
      ZoneCode: [''],
      RegionCode: [''],
      BranchEmpId: [''],
      BranchOpeningClosingDate: [''],
      BranchOpeningClosingAmount: [''],
      SingleLock2000Note: [],
      SingleLock500Note: [],
      SingleLock200Note: [],
      SingleLock100Note: [],
      SingleLock50Note: [],
      SingleLock20Note: [],
      SingleLock10Note: [],
      SingleLock5Note: [],
      SingleLock2Note: [],
      SingleLock1Note: [],
      SingleLock10Coin: [],
      SingleLock5Coin: [],
      SingleLock2Coin: [],
      SingleLock1Coin: [],
      SingleLock50pCoin: [],
      SingleLockGrandTotal: [],
      DoubleLock2000Note: [],
      DoubleLock500Note: [],
      DoubleLock200Note: [],
      DoubleLock100Note: [],
      DoubleLock50Note: [],
      DoubleLock20Note: [],
      DoubleLock10Note: [],
      DoubleLock5Note: [],
      DoubleLock2Note: [],
      DoubleLock1Note: [],
      DoubleLock10Coin: [],
      DoubleLock5Coin: [],
      DoubleLock2Coin: [],
      DoubleLock1Coin: [],
      DoubleLock50pCoin: [],
      DoubleLockGrandTotal: [],
      BranchNotHoldCutSoiledNotes: []
    });

    this.maxDate = this.today.toISOString().split('T')[0]; // Max = today;

    //Min = loginDate -1 month
    this.minDate = new Date(
      this.today.setDate(this.today.getDate() - 30)
    ).toISOString().split('T')[0]; //last 30 days
  }

  dateRangeValidator(min: string, max: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value)
        return null;
      const value = new Date(control.value);
      const minDate = new Date(min);
      const maxDate = new Date(max);

      if (value < minDate || value > maxDate) {
        return { outOfRange: true };
      }
      return null;
    };
  }
  dateFormat(date: Date): string {
    return date.toISOString().split('T')[0]; //yyyy-MM-dd
  }
  setFinancialYears() {

    // const currentYear = new Date().getFullYear();
    // this.financialYears = [
    //   `${currentYear - 1}-${currentYear % 100}`,
    //   `${currentYear}-${(currentYear + 1) % 100}`,
    //   `${currentYear + 1}-${(currentYear + 2 ) % 100}`
    // ];
    let startYear, endYear;

    if (this.currentMonth >= 3) {
      startYear = this.currentYear;
      endYear = this.currentYear + 1;
    }
    else {
      startYear = this.currentYear - 1;
      endYear = this.currentYear;
    }

    this.currentFinancialYear = `${startYear}-${endYear % 100}`;
    this.financialYears.push(this.currentFinancialYear);
    this.financialYears.push(`${startYear + 1}-${(endYear + 1) % 100}`);

    // if(this.currentQuarter === 1){
    //   this.financialYears.push(`${this.currentYear - 1}-${(this.currentYear % 100)}`);
    //   this.financialYears.push(`${this.currentYear}-${(this.currentYear + 1) % 100}`);
    // }
    // else
    // {
    //   this.financialYears.push(`${this.currentYear}-${(this.currentYear + 1) % 100}`);
    //   this.financialYears.push(`${this.currentYear + 1}-${(this.currentYear + 2) % 100}`);
    // }
  }


  setCurrentFinancialYearAndQuarter() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    let startyear = month >= 4 ? year : year - 1;
    let endyear = startyear + 1;
    this.FullYear = `${startyear}-${endyear}`;
    this.FinancialYear = `${startyear}-${endyear.toString().slice(-2)}`;
    this._persistanceService.setSessionStorage('currentFinancialYear', this.FinancialYear);


    if (month >= 4 && month <= 6) {
      this.Quater = "Q1";
    }
    else if (month >= 7 && month <= 9) {
      this.Quater = "Q2";
    }
    else if (month >= 10 && month <= 12) {
      this.Quater = "Q3";
    }
    else {
      this.Quater = "Q4";

    }

    this._persistanceService.setSessionStorage('currentQuarter', this.Quater);
  }

  getCUrrentYear(): number {
    return new Date().getFullYear();
  }



  onSelectionChange(event: any) {
    const selectedValue = event.target.value;
    this.showDescDiv = selectedValue === 'Yes';
    if (selectedValue === 'Yes') {
      this.annexureTwoForm.get('Discrepancies')?.reset();
    }
    else {
      const textInputControl2 = this.annexureTwoForm.get('Discrepancies')
      this.annexureTwoForm.get('Discrepancies')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  showAnnexureTwoDiv() {
    this.showAnnexure1Form = false;
    this.showAnnexure3Form = false;
    this.showAnnexure5Form = false;
    this.showAnnexure2Form = true;
  }

  HomeButton() {
    window.location.reload();
  }

  showAnnexureOneDiv() {
    this.showAnnexure1Form = true;
    this.showAnnexure2Form = false;

  }

  showAnnexureThreeDiv() {
    this.showAnnexure1Form = false;
    this.showAnnexure2Form = false;
    this.showAnnexure3Form = true;
  }

  showAnnexureFiveDiv() {

    this.showAnnexure1Form = false;
    this.showAnnexure2Form = false;
    this.showAnnexure3Form = false;
    this.showAnnexure4Form = false;
    this.showAnnexure5Form = true;
  }

  showAnnexureSixDiv() {
    this.showAnnexure1Form = false;
    this.showAnnexure2Form = false;
    this.showAnnexure3Form = false;
    this.showAnnexure4Form = false;
    this.showAnnexure5Form = false;
    this.showAnnexure6Form = true;
    this.getAnnexureOneData();
  }

  showAnnexureSevenDiv() {
    this.showAnnexure1Form = false;
    this.showAnnexure2Form = false;
    this.showAnnexure3Form = false;
    this.showAnnexure4Form = false;
    this.showAnnexure5Form = false;
    this.showAnnexure6Form = false;
    this.showAnnexure7Form = true;
  }

  showAnnexureFourDiv() {

    this.showAnnexure1Form = false;
    this.showAnnexure2Form = false;
    this.showAnnexure3Form = false;
    this.showAnnexure4Form = true;
  }

  getAnnexureOneData() {
    let currentYear = this._persistanceService.getSessionStorage('currentFinancialYear');
    let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
    let regionCode = this._persistanceService.getSessionStorage('region_code');
    this.surprisecash.getAnnexureOneData(currentYear, currentQuarter, regionCode).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.AnnexureOneAlldata = decryptData;
      },
      (error: any) => {
        console.log('error', error);
      });
  }

  getBranchData(FinancialYear: string, Quater: string, regionCode: string, divisionCode: string) {
    this.surprisecash.getUnNominatedBranch(FinancialYear, Quater, regionCode, divisionCode).subscribe((response: any) => {

      if (response.status == 'success') {
        this.BranchData = response.data;
      }
    })


  }


  matchBranchesWithData1() {
    this.BranchData.forEach(branch => {
      if (branch.isValid) {
        console.log("is valid");
      }
      else {
        console.log("not in db");
      }
    })
  }

  deleteAnnexureTwoData(REF_NO: string) {
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let userid = currentUser;
    if (userid) {
      this.surprisecash.deleteAnnexureTwoData(REF_NO, userid).subscribe((response: any) => {
        if (response.status == 'success') {
          this.notifier.success(response.message);
          this.checkAnnexureTwoGrid();
        } else {
          this.notifier.error(response.message);
        }
      },
        (error: any) => {
          console.log('error', error);
        });
    }
  }

  deleteAnnexureOneData(REF_NO: string) {
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let userid = currentUser;
    if (userid) {
      this.surprisecash.deleteAnnexureOneData(REF_NO, userid).subscribe((response: any) => {
        if (response.status == 'success') {
          this.notifier.success(response.message);
          this.getAnnexureOneData();
        } else {
          this.notifier.error(response.message);
        }
      },
        (error: any) => {
          console.log('error', error);
        });
    }
  }

  filteredRecords: any[] = [];

  BRonQuaterChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.value) {
      this.annexureTwodataGrid = [...this.filteredRecords];
    }
    else {
      this.annexureTwodataGrid = this.filteredRecords.filter(
        record => record.AnnexureOneData.QUATER === target.value
      );
    }
  }

  getBRQuater(): string[] {
    const quater = this.annexureTwodataGrid.map(record => record.AnnexureOneData.QUATER);
    return Array.from(new Set(quater));
  }

  getBRFinancialYear(): string[] {
    const financialyear = this.annexureTwodataGrid.map(record => record.AnnexureOneData.FINANCIAL_YEAR);
    return Array.from(new Set(financialyear));
  }


  getBRQuaterCO(): string[] {
    const quater = this.annexureTwodataGridCO.map(record => record.AnnexureOneData.QUATER);
    return Array.from(new Set(quater));
  }

  getBRFinancialYearCO(): string[] {
    const financialyear = this.annexureTwodataGridCO.map(record => record.AnnexureOneData.FINANCIAL_YEAR);
    return Array.from(new Set(financialyear));
  }

  getBRQuaterZO(): string[] {
    const quater = this.annexureTwodata.map(record => record.AnnexureOneData.QUATER);
    return Array.from(new Set(quater));
  }

  getBRFinancialYearZO(): string[] {
    const financialyear = this.annexureTwodata.map(record => record.AnnexureOneData.FINANCIAL_YEAR);
    return Array.from(new Set(financialyear));
  }

  checkAnnexureTwoGrid() {
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let current = currentUser;
    let currentYear = this._persistanceService.getSessionStorage('currentFinancialYear');
    let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
    this.annexureTwoForm.patchValue({
      FinancialYearTwo: currentYear,
      QuaterTwo: currentQuarter
    });
    if (current) {
      this.checkAnnexureTwo(current, currentYear, currentQuarter);
    }
  }
  checkAnnexureTwo(current: string, financialYear: string, quarter: string) {
    let regionCode = this._persistanceService.getSessionStorage('region_code');
    let regionName = this._persistanceService.getSessionStorage('region_name');

    this.surprisecash.checkAnnexureTwo(current, financialYear, quarter, regionCode, regionName).subscribe(
      (response: any) => {
        this.annexureTwoNoData = ''; //clear any previous message
        this.showTable = false;
        this.showAnnexure2details = false;
        this.showAnnexure1details = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.annexureTwodataGrid = decryptData;
        // console.log("Branch SCV report-DYRH", this.annexureTwodataGrid);
        if (!this.annexureTwodataGrid || this.annexureTwodataGrid.length == 0) {
          this.annexureTwoNoData = `No data to display for Financial Year: ${financialYear} and Quater: ${quarter}`;
          return;
        }
        this.filteredRecords = this.annexureTwodataGrid;
        //this.matchBranchesWithDataannexureTwo();
        // this.BRFinancialYear = this.getBRFinancialYear();
        // this.BRQuater = this.getBRQuater();
        this.buttonText = 'View';
        // console.log("DYRH Branch SCV report:", this.annexureTwodataGrid)
        this.annexureTwodataGrid.forEach(item => {

          item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By CO" ? item.labelName = "Complied By CO" :
            item.AnnexureTwoData.ANNEXURE_STATUS_ZO == "Not Complied By ZO" && item.AnnexureTwoData.ANNEXURE_STATUS_CO == null ? item.labelName = "Not Complied By ZO" :
              item.AnnexureTwoData.ANNEXURE_STATUS_ZO == "Complied By ZO" && item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By ZO" ? item.labelName = "Complied By ZO" :


                item.AnnexureTwoData.ANNEXURE_STATUS_RO == "Complied By RO" ? item.labelName = "Complied By RO" :
                  item.AnnexureTwoData.ANNEXURE_STATUS_ZO == null && item.AnnexureTwoData.ANNEXURE_STATUS_CO == null && item.AnnexureTwoData.ANNEXURE_STATUS_RO == "Not Complied By RO" ?
                    item.labelName = "Not Complied By RO" :

                    item.AnnexureTwoData.ANNEXURE_STATUS == "Deleted" ? item.labelName = "Deleted" : item.AnnexureTwoData.ANNEXURE_STATUS == null ? item.labelName = "Not Saved" :
                      item.AnnexureTwoData.ANNEXURE_STATUS == "Saved" ? item.labelName = "Saved" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" :
                        item.AnnexureTwoData.ANNEXURE_STATUS_BRANCH == "Scrutinized" ? item.labelName = "Scrutinized" :
                          item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.labelName = "Submitted";

        });
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }
  // item.AnnexureTwoData.ANNEXURE_STATUS == "Deleted" ? item.labelName = "Deleted" : item.AnnexureTwoData.CREATED_BY == current ? item.labelName = "Not Saved" :

  checkAnnexureTwoGridCO() {
    let currentYear = this._persistanceService.getSessionStorage('currentFinancialYear');
    let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
    this.annexureTwoForm.patchValue({
      FinancialYearTwo: currentYear,
      QuaterTwo: currentQuarter
    });

    this.checkAnnexureTwoCO(currentYear, currentQuarter);
  }
  checkAnnexureTwoCO(financialYear: string, quarter: string) {
    this.surprisecash.checkAnnexureTwoCO(financialYear, quarter).subscribe(
      (response: any) => {
        this.annexureTwoNoData = ''; //clear any previous message
        this.showTable = false;
        this.showAnnexure2details = false;
        this.showAnnexure1details = false;
        this.showAnnexureCOdetails = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.annexureTwodataGridCO = decryptData;
        // console.log("CO Branch scv report", this.annexureTwodataGridCO);
        if (!this.annexureTwodataGridCO || this.annexureTwodataGridCO.length == 0) {
          this.annexureTwoNoData = `No data to display for Financial Year: ${financialYear} and Quater: ${quarter}`;
          return;
        }

        this.annexureTwodataGridCO.forEach(item => {

          item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By CO" ? item.labelName = "Complied By CO" :
            item.labelName = "Not Complied By ZO";
        });
        this.filteredRecords = this.annexureTwodataGrid;
        // this.BRFinancialYear = this.getBRFinancialYearCO();
        // this.BRQuater = this.getBRQuaterCO();
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }
  checkAnnexureByRegionCode(regioncode: string) {
    this.surprisecash.checkAnnexureTwoDetailsByRegionCode(regioncode).subscribe(
      (response: any) => {
        this.showTable = false;
        this.showAnnexure2details = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))

        this.annexureTwodataFive = decryptData;

        this.matchBranchesWithDataannexureTwo();

        // console.log("checkAnnexureTwo", this.annexureTwodataFive);
        this.buttonText = 'View';

        this.annexureTwodata?.forEach(item => {
          item.AnnexureTwoData == null ? item.labelName = "Not Submitted" : item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" : item.labelName = "Submitted";

        });
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }


  checkAnnexureByRegionCodeQuater(FinancialYear: string, Quater: string) {

    if (this.annexureFiveForm.get('ZoneFive')?.value == "" || this.annexureFiveForm.get('RegionFive')?.value == "") {
      let loginzonecode = this._persistanceService.getSessionStorage('zone_code');
      let loginregioncode = this._persistanceService.getSessionStorage('region_code');

      this.annexureFiveForm.controls['ZoneFive'].setValue(loginzonecode);
      this.annexureFiveForm.controls['RegionFive'].setValue(loginregioncode);
    }
    let ZoneCode = this.annexureFiveForm.get('ZoneFive')?.value;
    let regioncode = this.annexureFiveForm.get('RegionFive')?.value;

    this.surprisecash.checkAnnexureTwoDetailsByRegionCodeQuater(FinancialYear, Quater, ZoneCode, regioncode).subscribe(
      (response: any) => {
        this.showTable = false;
        this.showAnnexure2details = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))

        this.annexureTwodataFive = decryptData;

        this.matchBranchesWithDataannexureTwo();

        // console.log("checkAnnexureTwo", this.annexureTwodata);
        this.buttonText = 'View';

        this.annexureTwodata.forEach(item => {

          item.AnnexureTwoData == null ? item.labelName = "Not Submitted" : item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" : item.labelName = "Submitted";

        });
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }

  checkAnnexureByZoneCode(zonecode: string, Quater: string) {

    this.surprisecash.checkAnnexureTwoDetailsByZoneCode(zonecode, Quater).subscribe(
      (response: any) => {
        this.showTable = false;
        this.showAnnexure2details = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.annexureTwodataFive = decryptData;
        // console.log("annexureTwodataFive", this.annexureTwodataFive);
        this.matchBranchesWithDataannexureTwo();

        // console.log("checkAnnexureTwo", this.annexureTwodata);
        this.buttonText = 'View';

        this.annexureTwodata.forEach(item => {

          item.AnnexureTwoData == null ? item.labelName = "Not Submitted" : item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" : item.labelName = "Submitted";

        });
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }
  onQuaterChangeTwo(event: Event) {
    var financialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
    var quarter = this.annexureTwoForm.get('QuaterTwo')?.value;
    let loginzonecode = this._persistanceService.getSessionStorage('zone_code');
    let EMP_DESGN = this._persistanceService.getSessionStorage('emp_desgn_code');
    let location = this._persistanceService.getSessionStorage('location');

    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let empId = this.annexureOneForm.get('LoggedUserId')?.value;
    var locDesc = this._persistanceService.getSessionStorage('location_desc');
    var Emp_Scale_Descr = this._persistanceService.getSessionStorage('Emp_Scale_Descr')

    console.log("onQuaterChangeTwo Location", locDesc);
    const officerScales = [
      'SCALE 4 OFFICER',
      'SCALE 5 OFFICER',
      'SCALE 6 OFFICER',
      'SCALE 7 OFFICER',
      'SCALE 8 OFFICER'
    ];
    if (locDesc?.startsWith('RO') && officerScales.includes(Emp_Scale_Descr)) {
      console.log("onQuaterChangeTwo Ro Yes", locDesc);
      this.checkAnnexureTwo(currentUser, financialYear, quarter);
    }
    else if (locDesc?.startsWith('ZO') && officerScales.includes(Emp_Scale_Descr)) {
      console.log("onQuaterChangeTwo Zo Yes", locDesc);
      this.checkAnnexureTwoDetailsByCO(loginzonecode, financialYear, quarter);
    }
    else {
      this.surprisecash.getLogInType(EMP_DESGN).subscribe((response: any) => {
        if (response.status == 'success' && response.rData?.status == 'Allow') {
          // console.log("First");
          const data = response.rData;
          // console.log(data);
          const userType = data.useR_TYPE;
          this.onQuaterTwoChangeLogin(userType, location, currentUser, financialYear, quarter, loginzonecode);
        }
        else {
          this.surprisecash.getCOLogIn(location, empId).subscribe((response: any) => {
            if (response.status == 'success' && response.rData?.status == 'Allow') {
              // console.log("CO");
              const data = response.rData;
              // console.log(data);
              const userType = data.useR_TYPE;
              this.onQuaterTwoChangeLogin(userType, location, currentUser, financialYear, quarter, loginzonecode);
            }
            else {
              // console.log("IO");
              this.onQuaterTwoChangeIOLogin(currentUser, financialYear, quarter);
            }
          });
        }
      });
    }

  }
  private onQuaterTwoChangeLogin(userType: string, location: string, currentUser: string, financialYear: string, quarter: string, loginzonecode: string) {
    switch (userType) {
      case 'BH':
        console.log('BH');
        this.checkAnnexureOneDetailsBySVBranchCodeService(location, currentUser, financialYear, quarter);
        break;
      case 'CO':
        console.log('CO');
        this.checkAnnexureTwoCO(financialYear, quarter);
        break;
      case 'DYRH':
        console.log('DYRH');
        this.checkAnnexureTwo(currentUser, financialYear, quarter);
        break;
      case 'ZO':
        console.log('ZO');
        this.checkAnnexureTwoDetailsByCO(loginzonecode, financialYear, quarter);
        break;
    }
  }
  private onQuaterTwoChangeIOLogin(currentUser: string, financialYear: string, quarter: string) {
    console.log('IO');
    this.checkAnnexureOneDetailsByPFnoService(currentUser, financialYear, quarter);
  }
  checkAnnexureByCO(zonecode: string) {
    let currentYear = this._persistanceService.getSessionStorage('currentFinancialYear');
    let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
    this.annexureTwoForm.patchValue({
      FinancialYearTwo: currentYear,
      QuaterTwo: currentQuarter
    });
    this.checkAnnexureTwoDetailsByCO(zonecode, currentYear, currentQuarter);
  }
  checkAnnexureTwoDetailsByCO(zonecode: string, financialYear: string, quarter: string) {
    this.surprisecash.checkAnnexureTwoDetailsByCO(zonecode, financialYear, quarter).subscribe(
      (response: any) => {
        this.annexureTwoNoData = ''; //clear any previous message
        this.showTable = false;
        this.showAnnexure2details = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.annexureTwodata = decryptData;
        // console.log("checkAnnexureTwoDetailsByCO", this.annexureTwodata);
        if (!this.annexureTwodata || this.annexureTwodata.length == 0) {
          this.annexureTwoNoData = `No data to display for Financial Year: ${financialYear} and Quater: ${quarter}`;
          // this.showAnnexure2details = false;
          return;
        }
        // this.BRFinancialYear = this.getBRFinancialYearZO();
        // this.BRQuater = this.getBRQuaterZO();
        this.matchBranchesWithDataannexureTwo();
        this.buttonText = 'View';
        this.annexureTwodata.forEach(item => {

          item.AnnexureTwoData == null ? item.labelName = "Not Submitted" : item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" : item.labelName = "Submitted";

        });
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }
  getAnnexureFiveDetails() {
    this.surprisecash.getAnnexureFiveDetails().subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.annexureFivedata = decryptData;

        if (decryptData.length == 0) {
          this.ShowDiscrepanciesThreeForm = true;
        }
        else {
          this.ShowDiscrepanciesThreeForm = false;
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }


  getAnnexureFourDetail(code: string) {
    let status = "Submitted";

    this.surprisecash.getAnnexureFourDetails(status, code).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))

        this.annexureFourdata = decryptData;

        if (decryptData.length == 0) {
          this.ShowDiscrepanciesFourForm = true;
        }
        else {
          this.ShowDiscrepanciesFourForm = false;
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }

  checkAnnexureThree(code: string, quater: string, iszone: string) {

    //let status = "Submitted";
    let status = "Approved";
    let financialYear = this.annexureThreeForm.get('FinancialYearAnnexure3')?.value;
    financialYear = financialYear == '' ? this._persistanceService.getSessionStorage('currentFinancialYear') : financialYear;
    quater = quater == '' ? this._persistanceService.getSessionStorage('currentQuarter') : quater;

    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    this.surprisecash.getAnnexure2Details(status, code, quater, iszone, financialYear, currentUser).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))

        if (decryptData.length != 0) {
          // this.annexureThreeForm.controls['RegionalHead'].setValue(decryptData[0].AnnexureOneData.FROM_DYRH_NAME);
          // this.annexureThreeForm.controls['RegionalOffice'].setValue(decryptData[0].AnnexureOneData.FROM_REGION_NAME);

          // console.log("Consolidated Report of RO", decryptData);

          this.annexureTwoBranchdata = decryptData;



          if (decryptData.length == 0) {

            this.showAnnexure3Form = false;

          }
          let MONTHLY_CASH_VERIFICATION_OF_CASH_YES = 0;
          let MONTHLY_CASH_VERIFICATION_OF_CASH_NO = 0;
          let MONTHLY_CASH_VERIFICATION_OF_CASH_NOT_TALLIED = '';
          let PERIODICAL_SURPRISE_CHECK_YES = 0;
          let PERIODICAL_SURPRISE_CHECK_NO = 0;
          let PERIODICAL_SURPRISE_CHECK_NOT_TALLIED = '';
          let KEPT_UNDER_JOINT_CUSTODY_YES = 0;
          let KEPT_UNDER_JOINT_CUSTODY_NO = 0;
          let KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED = '';
          let JOINT_CUSTODIAN_VERIFYING_YES = 0;
          let JOINT_CUSTODIAN_VERIFYING_NO = 0;
          let JOINT_CUSTODIAN_VERIFYING_NOT_TALLIED = '';
          let OTHER_GUIDELINES_COMPILED_YES = 0;
          let OTHER_GUIDELINES_COMPILED_NO = 0;
          let OTHER_GUIDELINES_COMPILED_NOT_TALLIED = '';
          let KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES = 0;
          let KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = 0;
          let KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED = '';
          let KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES = 0;
          let KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = 0;
          let KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NOT_TALLIED = '';
          let KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES = 0;
          let KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = 0;
          let KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NOT_TALLIED = '';
          let SAFE_CUSTODY_RECEIPT_YES = 0;
          let SAFE_CUSTODY_RECEIPT_NO = 0;
          let SAFE_CUSTODY_RECEIPT_NOT_TALLIED = '';
          let STAMPED_AGREEMENT_FORMS_YES = 0;
          let STAMPED_AGREEMENT_FORMS_NO = 0;
          let STAMPED_AGREEMENT_FORMS_NOT_TALLIED = '';
          let NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES = 0;
          let NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO = 0;
          let NO_OF_POST_PARCELS_HELD_BY_BRANCH_NOT_TALLIED = '';
          let POSTAL_STAMPS_YES = 0;
          let POSTAL_STAMPS_NO = 0;
          let POSTAL_STAMPS_NOT_TALLIED = '';
          let KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES = 0;
          let KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = 0;
          let KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NOT_TALLIED = '';
          let SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES = 0;
          let SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO = 0;
          let SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NOT_TALLIED = '';
          let SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES = 0;
          let SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO = 0;
          let SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NOT_TALLIED = '';
          let SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES = 0;
          let SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = 0;
          let SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NOT_TALLIED = '';
          let WHETHER_ULTRAVIOLET_LAMP_WORKING_YES = 0;
          let WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = 0;
          let WHETHER_ULTRAVIOLET_LAMP_WORKING_NOT_TALLIED = '';
          let CCTV_SYSTEM_IS_WORKING_YES = 0;
          let CCTV_SYSTEM_IS_WORKING_NO = 0;
          let CCTV_SYSTEM_IS_WORKING_NOT_TALLIED = '';
          let CASH_COUNTING_MACHINE_WORKING_YES = 0;
          let CASH_COUNTING_MACHINE_WORKING_NO = 0;
          let CASH_COUNTING_MACHINE_WORKING_NOT_TALLIED = '';
          let NOTE_SORTING_MACHINE_WORKING_YES = 0;
          let NOTE_SORTING_MACHINE_WORKING_NO = 0;
          let NOTE_SORTING_MACHINE_WORKING_NOT_TALLIED = '';
          let WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES = 0;
          let WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = 0;
          let WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NOT_TALLIED = '';
          let PHYSICAL_CASH_IN_ATM_VERIFIED_YES = 0;
          let PHYSICAL_CASH_IN_ATM_VERIFIED_NO = 0;
          let PHYSICAL_CASH_IN_ATM_VERIFIED_NOT_TALLIED = '';
          let WHETHERMACHINESORTEDNOTESYES = 0;
          let WHETHERMACHINESORTEDNOTESNO = 0;
          let WHETHERMACHINESORTEDNOTESNOTTALLIED = '';
          let WHETHERAVAITABITITYOFNAMYES = 0;
          let WHETHERAVAITABITITYOFNAMNO = 0;
          let WHETHERAVAITABITITYOFNAMNOTTALLIED = '';
          let WHETHERFIRYES = 0;
          let WHETHERFIRNO = 0;
          let WHETHERFIRNOTTALLIED = '';
          let MONTHTYCONSOTIDATEDREPORTYES = 0;
          let MONTHTYCONSOTIDATEDREPORTNO = 0;
          let MONTHTYCONSOTIDATEDREPORTNOTTALLIED = '';

          decryptData.forEach((item: any) => {
            item.AnnexureTwoData.MONTHLY_CASH_VERIFICATION_OF_CASH === "1" ? MONTHLY_CASH_VERIFICATION_OF_CASH_YES++ : (MONTHLY_CASH_VERIFICATION_OF_CASH_NO++, MONTHLY_CASH_VERIFICATION_OF_CASH_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.PERIODICAL_SURPRISE_CHECK === "1" ? PERIODICAL_SURPRISE_CHECK_YES++ : (PERIODICAL_SURPRISE_CHECK_NO++, PERIODICAL_SURPRISE_CHECK_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.KEPT_UNDER_JOINT_CUSTODY === "1" ? KEPT_UNDER_JOINT_CUSTODY_YES++ : (KEPT_UNDER_JOINT_CUSTODY_NO++, KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.JOINT_CUSTODIAN_VERIFYING === "1" ? JOINT_CUSTODIAN_VERIFYING_YES++ : (JOINT_CUSTODIAN_VERIFYING_NO++, JOINT_CUSTODIAN_VERIFYING_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.OTHER_GUIDELINES_COMPILED === "1" ? OTHER_GUIDELINES_COMPILED_YES++ : (OTHER_GUIDELINES_COMPILED_NO++, OTHER_GUIDELINES_COMPILED_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY === "1" ? KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES++ : (KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO++, KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED === "1" ? KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES++ : (KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO++, KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS === "1" ? KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES++ : (KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO++, KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.SAFE_CUSTODY_RECEIPT === "1" ? SAFE_CUSTODY_RECEIPT_YES++ : (SAFE_CUSTODY_RECEIPT_NO++, SAFE_CUSTODY_RECEIPT_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.STAMPED_AGREEMENT_FORMS === "1" ? STAMPED_AGREEMENT_FORMS_YES++ : (STAMPED_AGREEMENT_FORMS_NO++, STAMPED_AGREEMENT_FORMS_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.NO_OF_POST_PARCELS_HELD_BY_BRANCH === "1" ? NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES++ : (NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO++, NO_OF_POST_PARCELS_HELD_BY_BRANCH_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.POSTAL_STAMPS === "1" ? POSTAL_STAMPS_YES++ : (POSTAL_STAMPS_NO++, POSTAL_STAMPS_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS === "1" ? KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES++ : (KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO++, KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH === "1" ? SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES++ : (SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO++, SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM === "1" ? SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES++ : (SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO++, SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM === "1" ? SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES++ : (SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO++, SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.WHETHER_ULTRAVIOLET_LAMP_WORKING === "1" ? WHETHER_ULTRAVIOLET_LAMP_WORKING_YES++ : (WHETHER_ULTRAVIOLET_LAMP_WORKING_NO++, WHETHER_ULTRAVIOLET_LAMP_WORKING_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.CCTV_SYSTEM_IS_WORKING === "1" ? CCTV_SYSTEM_IS_WORKING_YES++ : (CCTV_SYSTEM_IS_WORKING_NO++, CCTV_SYSTEM_IS_WORKING_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.CASH_COUNTING_MACHINE_WORKING === "1" ? CASH_COUNTING_MACHINE_WORKING_YES++ : (CASH_COUNTING_MACHINE_WORKING_NO++, CASH_COUNTING_MACHINE_WORKING_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.NOTE_SORTING_MACHINE_WORKING === "1" ? NOTE_SORTING_MACHINE_WORKING_YES++ : (NOTE_SORTING_MACHINE_WORKING_NO++, NOTE_SORTING_MACHINE_WORKING_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH === "1" ? WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES++ : (WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO++, WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.PHYSICAL_CASH_IN_ATM_VERIFIED === "1" ? PHYSICAL_CASH_IN_ATM_VERIFIED_YES++ : (PHYSICAL_CASH_IN_ATM_VERIFIED_NO++, PHYSICAL_CASH_IN_ATM_VERIFIED_NOT_TALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'));
            item.AnnexureTwoData.WHETHERMACHINESORTEDNOTES === "1" ? WHETHERMACHINESORTEDNOTESYES++ : (WHETHERMACHINESORTEDNOTESNO++, WHETHERMACHINESORTEDNOTESNOTTALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'))
            item.AnnexureTwoData.WHETHERAVAITABITITYOFNAM === "1" ? WHETHERAVAITABITITYOFNAMYES++ : (WHETHERAVAITABITITYOFNAMNO++, WHETHERAVAITABITITYOFNAMNOTTALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'))
            item.AnnexureTwoData.WHETHERFIR === "1" ? WHETHERFIRYES++ : (WHETHERFIRNO++, WHETHERFIRNOTTALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'))
            item.AnnexureTwoData.MONTHTYCONSOTIDATEDREPORT === "1" ? MONTHTYCONSOTIDATEDREPORTYES++ : (MONTHTYCONSOTIDATEDREPORTNO++, MONTHTYCONSOTIDATEDREPORTNOTTALLIED += (item.AnnexureTwoData.SV_BRANCH_CODE + "-" + item.AnnexureTwoData.NAME_OF_BRANCH + '\n'))
          });


          this.MONTHLY_CASH_VERIFICATION_OF_CASH_YES = MONTHLY_CASH_VERIFICATION_OF_CASH_YES.toString();
          this.MONTHLY_CASH_VERIFICATION_OF_CASH_NO = MONTHLY_CASH_VERIFICATION_OF_CASH_NO.toString();
          this.MONTHLY_CASH_VERIFICATION_OF_CASH_NOT_TALLIED = MONTHLY_CASH_VERIFICATION_OF_CASH_NOT_TALLIED.toString();
          this.PERIODICAL_SURPRISE_CHECK_YES = PERIODICAL_SURPRISE_CHECK_YES.toString();
          this.PERIODICAL_SURPRISE_CHECK_NO = PERIODICAL_SURPRISE_CHECK_NO.toString();
          this.PERIODICAL_SURPRISE_CHECK_NOT_TALLIED = PERIODICAL_SURPRISE_CHECK_NOT_TALLIED.toString();
          this.KEPT_UNDER_JOINT_CUSTODY_YES = KEPT_UNDER_JOINT_CUSTODY_YES.toString();
          this.KEPT_UNDER_JOINT_CUSTODY_NO = KEPT_UNDER_JOINT_CUSTODY_NO.toString();
          this.KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED = KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED.toString();
          this.JOINT_CUSTODIAN_VERIFYING_YES = JOINT_CUSTODIAN_VERIFYING_YES.toString();
          this.JOINT_CUSTODIAN_VERIFYING_NO = JOINT_CUSTODIAN_VERIFYING_NO.toString();
          this.JOINT_CUSTODIAN_VERIFYING_NOT_TALLIED = JOINT_CUSTODIAN_VERIFYING_NOT_TALLIED.toString();
          this.OTHER_GUIDELINES_COMPILED_YES = OTHER_GUIDELINES_COMPILED_YES.toString();
          this.OTHER_GUIDELINES_COMPILED_NO = OTHER_GUIDELINES_COMPILED_NO.toString();
          this.OTHER_GUIDELINES_COMPILED_NOT_TALLIED = OTHER_GUIDELINES_COMPILED_NOT_TALLIED.toString();
          this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES = KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES.toString();
          this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO.toString();
          this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED = KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED.toString();
          this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES = KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES.toString();
          this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO.toString();
          this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NOT_TALLIED = KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NOT_TALLIED.toString();
          this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES = KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES.toString();
          this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO.toString();
          this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NOT_TALLIED = KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NOT_TALLIED.toString();
          this.SAFE_CUSTODY_RECEIPT_YES = SAFE_CUSTODY_RECEIPT_YES.toString();
          this.SAFE_CUSTODY_RECEIPT_NO = SAFE_CUSTODY_RECEIPT_NO.toString();
          this.SAFE_CUSTODY_RECEIPT_NOT_TALLIED = SAFE_CUSTODY_RECEIPT_NOT_TALLIED.toString();
          this.STAMPED_AGREEMENT_FORMS_YES = STAMPED_AGREEMENT_FORMS_YES.toString();
          this.STAMPED_AGREEMENT_FORMS_NO = STAMPED_AGREEMENT_FORMS_NO.toString();
          this.STAMPED_AGREEMENT_FORMS_NOT_TALLIED = STAMPED_AGREEMENT_FORMS_NOT_TALLIED.toString();
          this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES = NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES.toString();
          this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO = NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO.toString();
          this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_NOT_TALLIED = NO_OF_POST_PARCELS_HELD_BY_BRANCH_NOT_TALLIED.toString();
          this.POSTAL_STAMPS_YES = POSTAL_STAMPS_YES.toString();
          this.POSTAL_STAMPS_NO = POSTAL_STAMPS_NO.toString();
          this.POSTAL_STAMPS_NOT_TALLIED = POSTAL_STAMPS_NOT_TALLIED.toString();
          this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES = KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES.toString();
          this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO.toString();
          this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NOT_TALLIED = KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NOT_TALLIED.toString();
          this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES = SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES.toString();
          this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO = SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO.toString();
          this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NOT_TALLIED = SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NOT_TALLIED.toString();
          this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES = SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES.toString();
          this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO = SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO.toString();
          this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NOT_TALLIED = SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NOT_TALLIED.toString();
          this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES = SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES.toString();
          this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO.toString();
          this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NOT_TALLIED = SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NOT_TALLIED.toString();
          this.WHETHER_ULTRAVIOLET_LAMP_WORKING_YES = WHETHER_ULTRAVIOLET_LAMP_WORKING_YES.toString();
          this.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = WHETHER_ULTRAVIOLET_LAMP_WORKING_NO.toString();
          this.WHETHER_ULTRAVIOLET_LAMP_WORKING_NOT_TALLIED = WHETHER_ULTRAVIOLET_LAMP_WORKING_NOT_TALLIED.toString();
          this.CCTV_SYSTEM_IS_WORKING_YES = CCTV_SYSTEM_IS_WORKING_YES.toString();
          this.CCTV_SYSTEM_IS_WORKING_NO = CCTV_SYSTEM_IS_WORKING_NO.toString();
          this.CCTV_SYSTEM_IS_WORKING_NOT_TALLIED = CCTV_SYSTEM_IS_WORKING_NOT_TALLIED.toString();
          this.CASH_COUNTING_MACHINE_WORKING_YES = CASH_COUNTING_MACHINE_WORKING_YES.toString();
          this.CASH_COUNTING_MACHINE_WORKING_NO = CASH_COUNTING_MACHINE_WORKING_NO.toString();
          this.CASH_COUNTING_MACHINE_WORKING_NOT_TALLIED = CASH_COUNTING_MACHINE_WORKING_NOT_TALLIED.toString();
          this.NOTE_SORTING_MACHINE_WORKING_YES = NOTE_SORTING_MACHINE_WORKING_YES.toString();
          this.NOTE_SORTING_MACHINE_WORKING_NO = NOTE_SORTING_MACHINE_WORKING_NO.toString();
          this.NOTE_SORTING_MACHINE_WORKING_NOT_TALLIED = NOTE_SORTING_MACHINE_WORKING_NOT_TALLIED.toString();
          this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES = WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES.toString();
          this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO.toString();
          this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NOT_TALLIED = WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NOT_TALLIED.toString();
          this.PHYSICAL_CASH_IN_ATM_VERIFIED_YES = PHYSICAL_CASH_IN_ATM_VERIFIED_YES.toString();
          this.PHYSICAL_CASH_IN_ATM_VERIFIED_NO = PHYSICAL_CASH_IN_ATM_VERIFIED_NO.toString();
          this.PHYSICAL_CASH_IN_ATM_VERIFIED_NOT_TALLIED = PHYSICAL_CASH_IN_ATM_VERIFIED_NOT_TALLIED.toString();
          this.WHETHERMACHINESORTEDNOTESYES = WHETHERMACHINESORTEDNOTESYES.toString();
          this.WHETHERMACHINESORTEDNOTESNO = WHETHERMACHINESORTEDNOTESNO.toString();
          this.WHETHERMACHINESORTEDNOTESNOTTALLIED = WHETHERMACHINESORTEDNOTESNOTTALLIED.toString();
          this.WHETHERAVAITABITITYOFNAMYES = WHETHERAVAITABITITYOFNAMYES.toString();
          this.WHETHERAVAITABITITYOFNAMNO = WHETHERAVAITABITITYOFNAMNO.toString();
          this.WHETHERAVAITABITITYOFNAMNOTTALLIED = WHETHERAVAITABITITYOFNAMNOTTALLIED.toString();
          this.WHETHERFIRYES = WHETHERFIRYES.toString();
          this.WHETHERFIRNO = WHETHERFIRNO.toString();
          this.WHETHERFIRNOTTALLIED = WHETHERFIRNOTTALLIED.toString();
          this.MONTHTYCONSOTIDATEDREPORTYES = MONTHTYCONSOTIDATEDREPORTYES.toString();
          this.MONTHTYCONSOTIDATEDREPORTNO = MONTHTYCONSOTIDATEDREPORTNO.toString();
          this.MONTHTYCONSOTIDATEDREPORTNOTTALLIED = MONTHTYCONSOTIDATEDREPORTNOTTALLIED.toString();
        }
        else {

          this.MONTHLY_CASH_VERIFICATION_OF_CASH_YES = "";
          this.MONTHLY_CASH_VERIFICATION_OF_CASH_NO = "";
          this.MONTHLY_CASH_VERIFICATION_OF_CASH_NOT_TALLIED = "";
          this.PERIODICAL_SURPRISE_CHECK_YES = "";
          this.PERIODICAL_SURPRISE_CHECK_NO = "";
          this.PERIODICAL_SURPRISE_CHECK_NOT_TALLIED = "";
          this.KEPT_UNDER_JOINT_CUSTODY_YES = "";
          this.KEPT_UNDER_JOINT_CUSTODY_NO = "";
          this.KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED = "";
          this.JOINT_CUSTODIAN_VERIFYING_YES = "";
          this.JOINT_CUSTODIAN_VERIFYING_NO = "";
          this.JOINT_CUSTODIAN_VERIFYING_NOT_TALLIED = "";
          this.OTHER_GUIDELINES_COMPILED_YES = "";
          this.OTHER_GUIDELINES_COMPILED_NO = "";
          this.OTHER_GUIDELINES_COMPILED_NOT_TALLIED = "";
          this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES = "";
          this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = "";
          this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NOT_TALLIED = "";
          this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES = "";
          this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = "";
          this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NOT_TALLIED = "";
          this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES = "";
          this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = "";
          this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NOT_TALLIED = "";
          this.SAFE_CUSTODY_RECEIPT_YES = "";
          this.SAFE_CUSTODY_RECEIPT_NO = "";
          this.SAFE_CUSTODY_RECEIPT_NOT_TALLIED = "";
          this.STAMPED_AGREEMENT_FORMS_YES = "";
          this.STAMPED_AGREEMENT_FORMS_NO = "";
          this.STAMPED_AGREEMENT_FORMS_NOT_TALLIED = "";
          this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES = "";
          this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO = "";
          this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_NOT_TALLIED = "";
          this.POSTAL_STAMPS_YES = "";
          this.POSTAL_STAMPS_NO = "";
          this.POSTAL_STAMPS_NOT_TALLIED = "";
          this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES = "";
          this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = "";
          this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NOT_TALLIED = "";
          this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES = "";
          this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO = "";
          this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NOT_TALLIED = "";
          this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES = "";
          this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO = "";
          this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NOT_TALLIED = "";
          this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES = "";
          this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = "";
          this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NOT_TALLIED = "";
          this.WHETHER_ULTRAVIOLET_LAMP_WORKING_YES = "";
          this.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = "";
          this.WHETHER_ULTRAVIOLET_LAMP_WORKING_NOT_TALLIED = "";
          this.CCTV_SYSTEM_IS_WORKING_YES = "";
          this.CCTV_SYSTEM_IS_WORKING_NO = "";
          this.CCTV_SYSTEM_IS_WORKING_NOT_TALLIED = "";
          this.CASH_COUNTING_MACHINE_WORKING_YES = "";
          this.CASH_COUNTING_MACHINE_WORKING_NO = "";
          this.CASH_COUNTING_MACHINE_WORKING_NOT_TALLIED = "";
          this.NOTE_SORTING_MACHINE_WORKING_YES = "";
          this.NOTE_SORTING_MACHINE_WORKING_NO = "";
          this.NOTE_SORTING_MACHINE_WORKING_NOT_TALLIED = "";
          this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES = "";
          this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = "";
          this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NOT_TALLIED = "";
          this.PHYSICAL_CASH_IN_ATM_VERIFIED_YES = "";
          this.PHYSICAL_CASH_IN_ATM_VERIFIED_NO = "";
          this.PHYSICAL_CASH_IN_ATM_VERIFIED_NOT_TALLIED = "";
          this.WHETHERMACHINESORTEDNOTESYES = "";
          this.WHETHERMACHINESORTEDNOTESNO = "";
          this.WHETHERMACHINESORTEDNOTESNOTTALLIED = "";
          this.WHETHERAVAITABITITYOFNAMYES = "";
          this.WHETHERAVAITABITITYOFNAMNO = "";
          this.WHETHERAVAITABITITYOFNAMNOTTALLIED = "";
          this.WHETHERFIRYES = "";
          this.WHETHERFIRNO = "";
          this.WHETHERFIRNOTTALLIED = "";
          this.MONTHTYCONSOTIDATEDREPORTYES = "";
          this.MONTHTYCONSOTIDATEDREPORTNO = "";
          this.MONTHTYCONSOTIDATEDREPORTNOTTALLIED = "";
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    )

  }

  on2000Change() {
    const notes2000 = this.annexureTwoForm.get('Notes2000')?.value;
    if (!isNaN(notes2000)) {
      this.Total2000Amount = notes2000 * 2000;
    }
    else {
      this.Total2000Amount = 0;
    }
    this.calculateTotalSum();
  }

  on500Change() {
    const notes500 = this.annexureTwoForm.get('Notes500')?.value;
    if (!isNaN(notes500)) {
      this.Total500Amount = notes500 * 500;
    }
    else {
      this.Total500Amount = 0;
    }
    this.calculateTotalSum();
  }

  on200Change() {
    const notes200 = this.annexureTwoForm.get('Notes200')?.value;
    if (!isNaN(notes200)) {
      this.Total200Amount = notes200 * 200;
    }
    else {
      this.Total200Amount = 0;
    }
    this.calculateTotalSum();
  }

  on100Change() {
    const notes100 = this.annexureTwoForm.get('Notes100')?.value;
    if (!isNaN(notes100)) {
      this.Total100Amount = notes100 * 100;
    }
    else {
      this.Total100Amount = 0;
    }
    this.calculateTotalSum();
  }

  on50Change() {
    const notes50 = this.annexureTwoForm.get('Notes50')?.value;
    if (!isNaN(notes50)) {
      this.Total50Amount = notes50 * 50;
    }
    else {
      this.Total50Amount = 0;
    }
    this.calculateTotalSum();
  }

  on20Change() {
    const notes20 = this.annexureTwoForm.get('Notes20')?.value;
    if (!isNaN(notes20)) {
      this.Total20Amount = notes20 * 20;
    }
    else {
      this.Total20Amount = 0;
    }
    this.calculateTotalSum();
  }

  on10Change() {
    const notes10 = this.annexureTwoForm.get('Notes10')?.value;
    if (!isNaN(notes10)) {
      this.Total10Amount = notes10 * 10;
    }
    else {
      this.Total10Amount = 0;
    }
    this.calculateTotalSum();
  }

  on5Change() {
    const notes5 = this.annexureTwoForm.get('Notes5')?.value;
    if (!isNaN(notes5)) {
      this.Total5Amount = notes5 * 5;
    }
    else {
      this.Total5Amount = 0;
    }
    this.calculateTotalSum();
  }

  on2Change() {
    const notes2 = this.annexureTwoForm.get('Notes2')?.value;
    if (!isNaN(notes2)) {
      this.Total2Amount = notes2 * 2;
    }
    else {
      this.Total2Amount = 0;
    }
    this.calculateTotalSum();
  }

  on1Change() {
    const notes1 = this.annexureTwoForm.get('Notes1')?.value;
    if (!isNaN(notes1)) {
      this.Total1Amount = notes1 * 1;
    }
    else {
      this.Total1Amount = 0;
    }
    this.calculateTotalSum();
  }
  on20ChangeCoins() {
    const coins20 = this.annexureTwoForm.get('Coins20')?.value;
    if (!isNaN(coins20)) {
      this.Total20AmountCoins = coins20 * 20;
    }
    else {
      this.Total20AmountCoins = 0;
    }
    this.calculateTotalSum();
  }
  on10ChangeCoins() {
    const coins10 = this.annexureTwoForm.get('Coins10')?.value;
    if (!isNaN(coins10)) {
      this.Total10AmountCoins = coins10 * 10;
    }
    else {
      this.Total10AmountCoins = 0;
    }
    this.calculateTotalSum();
  }
  on5ChangeCoins() {
    const coins5 = this.annexureTwoForm.get('Coins5')?.value;
    if (!isNaN(coins5)) {
      this.Total5AmountCoins = coins5 * 5;
    }
    else {
      this.Total5AmountCoins = 0;
    }
    this.calculateTotalSum();
  }
  on2ChangeCoins() {
    const coins2 = this.annexureTwoForm.get('Coins2')?.value;
    if (!isNaN(coins2)) {
      this.Total2AmountCoins = coins2 * 2;
    }
    else {
      this.Total2AmountCoins = 0;
    }
    this.calculateTotalSum();
  }
  on1ChangeCoins() {
    const coins1 = this.annexureTwoForm.get('Coins1')?.value;
    if (!isNaN(coins1)) {
      this.Total1AmountCoins = coins1 * 1;
    }
    else {
      this.Total1AmountCoins = 0;
    }
    this.calculateTotalSum();
  }
  on50PaisaChangeCoins() {
    const coins50Paisa = this.annexureTwoForm.get('Coins50Paisa')?.value;
    if (!isNaN(coins50Paisa)) {
      this.Total50PaisaAmountCoins = coins50Paisa * 0.5;
    }
    else {
      this.Total50PaisaAmountCoins = 0;
    }

    this.calculateTotalSum();
  }

  calculateTotalSum() {
    this.TotalSum = this.Total2000Amount + this.Total500Amount + this.Total200Amount + this.Total100Amount + this.Total50Amount + this.Total20Amount + this.Total10Amount
      + this.Total5Amount + this.Total2Amount + this.Total1Amount + this.Total20AmountCoins + this.Total10AmountCoins + this.Total5AmountCoins + this.Total2AmountCoins +
      this.Total1AmountCoins + this.Total50PaisaAmountCoins;

    const toWords = new ToWords({
      localeCode: 'en-IN',
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
      }
    });

    this.amountToWords = toWords.convert(this.TotalSum);
    this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue(this.amountToWords)
  }

  convertAmountToWords(amount: number) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousand = ['Thousand'];
    const lakh = ['Lakh'];
    const crore = ['Crore'];

    // if (amount === 0)
    // {
    //   this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue('Zero Rupees Only');
    //   return;
    // }

    const convertHundreds = (num: number): string => {
      let str = '';

      if (num >= 10000000) {
        const crores = Math.floor(num / 10000000);
        str += ones[crores] + ' Crore ';
        num %= 10000000;
      }


      if (num >= 100000) {
        const lakhs = Math.floor(num / 100000);
        str += ones[lakhs] + ' Lakh ';
        num %= 100000;
      }

      if (num >= 1000) {
        const thousands = Math.floor(num / 1000);
        //words += this.convertAmountToWords(Math.floor(amount / 1000)) + ' Thousand ';
        str += ones[thousands] + ' Thousand ';
        num %= 1000;
      }

      if (num >= 100) {
        str += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }

      if (num >= 20) {
        str += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        str += teens[num - 10] + ' ';
        num = 0;
      }

      if (num > 0) {
        str += ones[num] + ' ';
      }
      return str.trim();
    };
    const convertAmount = (num: number): string => {
      let result = '';
      let place = 0;

      while (num > 0) {
        let chunk = num % 1000;
        if (chunk > 0) {
          let chunkwords = convertHundreds(chunk);
          if (thousand[place]) {
            chunkwords += ' ' + thousand[place];
          }
          // if (lakh[place])
          // {
          //   chunkwords += ' ' + lakh[place];
          // }
          // if (crore[place])
          // {
          //   chunkwords += ' ' + crore[place];
          // }
          result = chunkwords + ' ' + result;
        }
        num = Math.floor(num / 1000);
        //place++;
      }
      while (num > 0) {
        let chunk = num % 100000;
        if (chunk > 0) {
          let chunkwords = convertHundreds(chunk);

          if (lakh[place]) {
            chunkwords += ' ' + lakh[place];
          }
          result = chunkwords + ' ' + result;
        }
        num = Math.floor(num / 100000);
        //place++;
      }
      while (num > 0) {
        let chunk = num % 10000000;
        if (chunk > 0) {
          let chunkwords = convertHundreds(chunk);

          if (crore[place]) {
            chunkwords += ' ' + crore[place];
          }
          result = chunkwords + ' ' + result;
        }
        num = Math.floor(num / 10000000);
        //place++;
      }
      return result.trim();
    };

    let words = amount === 0 ? 'Zero' : convertAmount(amount);

    words += ' Rupees Only';

    this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue(words.trim())
  }

  ShowingNo1(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoV1 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustodyNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustodyNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustodyNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo2(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoV2 = target.value === '0';
    if (target.value == '1') {
      this.ShowingNoV2Date = target.value === '1';
      this.ShowingNoV2 = false;
      const textInputControl16 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysDate')
      textInputControl16?.setValidators([Validators.required]);
      textInputControl16?.updateValueAndValidity();
      this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysDate')?.reset();
      this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysDate'].setValue(this.maxDate);
    }
    else {
      this.ShowingNoV2 = target.value === '0';
      this.ShowingNoV2Date = false;
      const textInputControl2 = this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')?.reset();
    }
  }
  ShowingNo3(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoV3 = target.value === '0';
    const textInputControl2 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }
  //backup
  // ShowingNo22(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   this.ShowingNoV2 = target.value === '0';
  //   const textInputControl2 = this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')
  //   if (target.value == '0') {
  //     textInputControl2?.setValidators([Validators.required]);
  //     textInputControl2?.updateValueAndValidity();
  //     this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')?.reset();
  //   }
  //   else {
  //     this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')?.updateValueAndValidity();
  //     textInputControl2?.setValidators(null);
  //     textInputControl2?.updateValueAndValidity();
  //     textInputControl2?.clearValidators();
  //   }
  // }

  // ShowingNo3(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   if (target.value == '1') {
  //     this.ShowingNoV3Date = target.value === '1';
  //     this.ShowingNoV3 = false;
  //     const textInputControl16 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysDate')
  //     textInputControl16?.setValidators([Validators.required]);
  //     textInputControl16?.updateValueAndValidity();
  //     this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysDate')?.reset();
  //     this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysDate'].setValue(this.maxDate);
  //   }
  //   else {
  //     this.ShowingNoV3 = target.value === '0';
  //     this.ShowingNoV3Date = false;
  //     const textInputControl2 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')
  //     textInputControl2?.setValidators([Validators.required]);
  //     textInputControl2?.updateValueAndValidity();
  //     this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')?.reset();
  //   }
  // }

  ShowingNo4(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoV4 = target.value === '0';


    const textInputControl2 = this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockersNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockersNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockersNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNoVI1(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoVI = target.value === '0';



    const textInputControl2 = this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystemNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystemNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystemNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo5(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoVII1 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('WhetherUltravioletLampProvidedNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('WhetherUltravioletLampProvidedNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('WhetherUltravioletLampProvidedNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo6(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoVII2 = target.value === '0';



    const textInputControl2 = this.annexureTwoForm.get('WhetherUltravioletLampWorkingNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('WhetherUltravioletLampWorkingNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('WhetherUltravioletLampWorkingNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo7(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoVIII1 = target.value === '0';


    const textInputControl2 = this.annexureTwoForm.get('CCTVSystemIsProvidedNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('CCTVSystemIsProvidedNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('CCTVSystemIsProvidedNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo8(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoVIII2 = target.value === '0';


    const textInputControl2 = this.annexureTwoForm.get('CCTVSystemIsWorkingNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('CCTVSystemIsWorkingNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('CCTVSystemIsWorkingNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo9(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoVIII3 = target.value === '0';


    const textInputControl2 = this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailableNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailableNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailableNo')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo10(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoIX1 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('CashCountingMachineProvidedNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('CashCountingMachineProvidedNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('CashCountingMachineProvidedNo')?.updateValueAndValidity();
      //textInputControl2?.clearValidators();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }

  }

  ShowingNo16(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNo161 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('WhetherAvaitabitityofNAMNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('WhetherAvaitabitityofNAMNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('WhetherAvaitabitityofNAMNo')?.updateValueAndValidity();
      //textInputControl2?.clearValidators();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }

  }

  ShowingNo17(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNo171 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('WhetherFIRNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('WhetherFIRNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('WhetherFIRNo')?.updateValueAndValidity();
      //textInputControl2?.clearValidators();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }
  }

  ShowingNo18(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNo181 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('MonthtyConsotidatedReportNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('MonthtyConsotidatedReportNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('MonthtyConsotidatedReportNo')?.updateValueAndValidity();
      //textInputControl2?.clearValidators();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }

  }

  ShowingNo11(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoIX2 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('CashCountingMachineWorkingNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('CashCountingMachineWorkingNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('CashCountingMachineWorkingNo')?.updateValueAndValidity();
      //textInputControl2?.clearValidators();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }

  }

  ShowingNo12(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNoXI = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('SecurityGuardIsInvolvedDetails')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('SecurityGuardIsInvolvedDetails')?.reset();
    }
    else {
      this.annexureTwoForm.get('SecurityGuardIsInvolvedDetails')?.updateValueAndValidity();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }



  }

  ShowingNo13(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value == '1') {
      this.ShowingNoXII1Date = target.value === '1';
      this.ShowingNoXII1 = false;
      // const textInputControl2 = this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashDate')

      // textInputControl2?.setValidators([Validators.required]);
      // textInputControl2?.updateValueAndValidity();
      // this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashDate')?.reset();
    }
    else {
      this.ShowingNoXII1 = target.value === '0';
      this.ShowingNoXII1Date = false;
      const textInputControl2 = this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashNo')

      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashNo')?.reset();
    }
  }

  ShowingNo14(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value == '1') {
      this.ShowingNoXII2Date = target.value === '1';
      this.ShowingNoXII2 = false;
      // const textInputControl2 = this.annexureTwoForm.get('PhysicalCashInAtmVerifiedDate')

      // textInputControl2?.setValidators([Validators.required]);
      // textInputControl2?.updateValueAndValidity();
      // this.annexureTwoForm.get('PhysicalCashInAtmVerifiedDate')?.reset();
    }
    else {
      this.ShowingNoXII2 = target.value === '0';
      this.ShowingNoXII2Date = false;

      const textInputControl2 = this.annexureTwoForm.get('PhysicalCashInAtmVerifiedNo')

      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('PhysicalCashInAtmVerifiedNo')?.reset();
    }
  }

  ShowingNo15(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ShowingNo121 = target.value === '0';

    const textInputControl2 = this.annexureTwoForm.get('WhetherMachineSortedNotesNo')
    if (target.value == '0') {
      textInputControl2?.setValidators([Validators.required]);
      textInputControl2?.updateValueAndValidity();
      this.annexureTwoForm.get('WhetherMachineSortedNotesNo')?.reset();
    }
    else {
      this.annexureTwoForm.get('WhetherMachineSortedNotesNo')?.updateValueAndValidity();
      //textInputControl2?.clearValidators();
      textInputControl2?.setValidators(null);
      textInputControl2?.updateValueAndValidity();
      textInputControl2?.clearValidators();
    }

  }

  checkAnnexureFour(zonecode: string, iszone: string, year: string, quater: string) {

    let status = "Approved";
    this.surprisecash.getAnnexure4Details(status, zonecode, iszone, year, quater).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        // console.log("checkAnnexureThree", decryptData);


        //this.annexureFourdata = decryptData;

        // if (decryptData.length == 0) {

        //   this.showAnnexure4Form = false;
        // }
        let MONTHLY_CASH_VERIFICATION_OF_CASH_YES = 0;
        let MONTHLY_CASH_VERIFICATION_OF_CASH_NO = 0;
        let PERIODICAL_SURPRISE_CHECK_YES = 0;
        let PERIODICAL_SURPRISE_CHECK_NO = 0;
        let KEPT_UNDER_JOINT_CUSTODY_YES = 0;
        let KEPT_UNDER_JOINT_CUSTODY_NO = 0;
        let JOINT_CUSTODIAN_VERIFYING_YES = 0;
        let JOINT_CUSTODIAN_VERIFYING_NO = 0;
        let OTHER_GUIDELINES_COMPILED_YES = 0;
        let OTHER_GUIDELINES_COMPILED_NO = 0;
        let KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES = 0;
        let KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = 0;
        let KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES = 0;
        let KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = 0;
        let KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES = 0;
        let KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = 0;
        let SAFE_CUSTODY_RECEIPT_YES = 0;
        let SAFE_CUSTODY_RECEIPT_NO = 0;
        let STAMPED_AGREEMENT_FORMS_YES = 0;
        let STAMPED_AGREEMENT_FORMS_NO = 0;
        let NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES = 0;
        let NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO = 0;
        let POSTAL_STAMPS_YES = 0;
        let POSTAL_STAMPS_NO = 0;
        let KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES = 0;
        let KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = 0;
        let SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES = 0;
        let SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO = 0;
        let SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES = 0;
        let SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO = 0;
        let SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES = 0;
        let SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = 0;
        let WHETHER_ULTRAVIOLET_LAMP_WORKING_YES = 0;
        let WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = 0;
        let CCTV_SYSTEM_IS_WORKING_YES = 0;
        let CCTV_SYSTEM_IS_WORKING_NO = 0;
        let CASH_COUNTING_MACHINE_WORKING_YES = 0;
        let CASH_COUNTING_MACHINE_WORKING_NO = 0;
        let NOTE_SORTING_MACHINE_WORKING_YES = 0;
        let NOTE_SORTING_MACHINE_WORKING_NO = 0;
        let WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES = 0;
        let WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = 0;
        let PHYSICAL_CASH_IN_ATM_VERIFIED_YES = 0;
        let PHYSICAL_CASH_IN_ATM_VERIFIED_NO = 0;
        let WHETHERMACHINESORTEDNOTESYES = 0;
        let WHETHERMACHINESORTEDNOTESNO = 0;
        let WHETHERAVAITABITITYOFNAMYES = 0;
        let WHETHERAVAITABITITYOFNAMNO = 0;
        let WHETHERFIRYES = 0;
        let WHETHERFIRNO = 0;
        let MONTHTYCONSOTIDATEDREPORTYES = 0;
        let MONTHTYCONSOTIDATEDREPORTNO = 0;

        decryptData.forEach((item: any) => {
          item.MONTHLY_CASH_VERIFICATION_OF_CASH === "1" ? MONTHLY_CASH_VERIFICATION_OF_CASH_YES++ : MONTHLY_CASH_VERIFICATION_OF_CASH_NO++;
          item.PERIODICAL_SURPRISE_CHECK === "1" ? PERIODICAL_SURPRISE_CHECK_YES++ : PERIODICAL_SURPRISE_CHECK_NO++;
          item.KEPT_UNDER_JOINT_CUSTODY === "1" ? KEPT_UNDER_JOINT_CUSTODY_YES++ : KEPT_UNDER_JOINT_CUSTODY_NO++;
          item.JOINT_CUSTODIAN_VERIFYING === "1" ? JOINT_CUSTODIAN_VERIFYING_YES++ : JOINT_CUSTODIAN_VERIFYING_NO++;
          item.OTHER_GUIDELINES_COMPILED === "1" ? OTHER_GUIDELINES_COMPILED_YES++ : OTHER_GUIDELINES_COMPILED_NO++;
          item.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY === "1" ? KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES++ : KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO++;
          item.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED === "1" ? KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES++ : KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO++;
          item.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS === "1" ? KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES++ : KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO++;
          item.SAFE_CUSTODY_RECEIPT === "1" ? SAFE_CUSTODY_RECEIPT_YES++ : SAFE_CUSTODY_RECEIPT_NO++;
          item.STAMPED_AGREEMENT_FORMS === "1" ? STAMPED_AGREEMENT_FORMS_YES++ : STAMPED_AGREEMENT_FORMS_NO++;
          item.NO_OF_POST_PARCELS_HELD_BY_BRANCH === "1" ? NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES++ : NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO++;
          item.POSTAL_STAMPS === "1" ? POSTAL_STAMPS_YES++ : POSTAL_STAMPS_NO++;
          item.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS === "1" ? KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES++ : KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO++;
          item.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH === "1" ? SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES++ : SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO++;
          item.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM === "1" ? SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES++ : SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO++;
          item.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM === "1" ? SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES++ : SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO++;
          item.WHETHER_ULTRAVIOLET_LAMP_WORKING === "1" ? WHETHER_ULTRAVIOLET_LAMP_WORKING_YES++ : WHETHER_ULTRAVIOLET_LAMP_WORKING_NO++;
          item.CCTV_SYSTEM_IS_WORKING === "1" ? CCTV_SYSTEM_IS_WORKING_YES++ : CCTV_SYSTEM_IS_WORKING_NO++;
          item.CASH_COUNTING_MACHINE_WORKING === "1" ? CASH_COUNTING_MACHINE_WORKING_YES++ : CASH_COUNTING_MACHINE_WORKING_NO++;
          item.NOTE_SORTING_MACHINE_WORKING === "1" ? NOTE_SORTING_MACHINE_WORKING_YES++ : NOTE_SORTING_MACHINE_WORKING_NO++;
          item.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH === "1" ? WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES++ : WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO++;
          item.PHYSICAL_CASH_IN_ATM_VERIFIED === "1" ? PHYSICAL_CASH_IN_ATM_VERIFIED_YES++ : PHYSICAL_CASH_IN_ATM_VERIFIED_NO++;
          item.WHETHERMACHINESORTEDNOTES === "1" ? WHETHERMACHINESORTEDNOTESYES++ : WHETHERMACHINESORTEDNOTESNO++;
          item.WHETHERAVAITABITITYOFNAM === "1" ? WHETHERAVAITABITITYOFNAMYES++ : WHETHERAVAITABITITYOFNAMNO++;
          item.WHETHERFIR === "1" ? WHETHERFIRYES++ : WHETHERFIRNO++;
          item.MONTHTYCONSOTIDATEDREPORT === "1" ? MONTHTYCONSOTIDATEDREPORTYES++ : MONTHTYCONSOTIDATEDREPORTNO++;
        });


        this.MONTHLY_CASH_VERIFICATION_OF_CASH_YES = MONTHLY_CASH_VERIFICATION_OF_CASH_YES.toString();
        this.MONTHLY_CASH_VERIFICATION_OF_CASH_NO = MONTHLY_CASH_VERIFICATION_OF_CASH_NO.toString();
        this.PERIODICAL_SURPRISE_CHECK_YES = PERIODICAL_SURPRISE_CHECK_YES.toString();
        this.PERIODICAL_SURPRISE_CHECK_NO = PERIODICAL_SURPRISE_CHECK_NO.toString();
        this.KEPT_UNDER_JOINT_CUSTODY_YES = KEPT_UNDER_JOINT_CUSTODY_YES.toString();
        this.KEPT_UNDER_JOINT_CUSTODY_NO = KEPT_UNDER_JOINT_CUSTODY_NO.toString();
        this.JOINT_CUSTODIAN_VERIFYING_YES = JOINT_CUSTODIAN_VERIFYING_YES.toString();
        this.JOINT_CUSTODIAN_VERIFYING_NO = JOINT_CUSTODIAN_VERIFYING_NO.toString();
        this.OTHER_GUIDELINES_COMPILED_YES = OTHER_GUIDELINES_COMPILED_YES.toString();
        this.OTHER_GUIDELINES_COMPILED_NO = OTHER_GUIDELINES_COMPILED_NO.toString();
        this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES = KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_YES.toString();
        this.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO = KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO.toString();
        this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES = KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_YES.toString();
        this.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO = KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO.toString();
        this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES = KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_YES.toString();
        this.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO = KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO.toString();
        this.SAFE_CUSTODY_RECEIPT_YES = SAFE_CUSTODY_RECEIPT_YES.toString();
        this.SAFE_CUSTODY_RECEIPT_NO = SAFE_CUSTODY_RECEIPT_NO.toString();
        this.STAMPED_AGREEMENT_FORMS_YES = STAMPED_AGREEMENT_FORMS_YES.toString();
        this.STAMPED_AGREEMENT_FORMS_NO = STAMPED_AGREEMENT_FORMS_NO.toString();
        this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES = NO_OF_POST_PARCELS_HELD_BY_BRANCH_YES.toString();
        this.NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO = NO_OF_POST_PARCELS_HELD_BY_BRANCH_NO.toString();
        this.POSTAL_STAMPS_YES = POSTAL_STAMPS_YES.toString();
        this.POSTAL_STAMPS_NO = POSTAL_STAMPS_NO.toString();
        this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES = KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_YES.toString();
        this.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO = KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO.toString();
        this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES = SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_YES.toString();
        this.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO = SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH_NO.toString();
        this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES = SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_YES.toString();
        this.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO = SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM_NO.toString();
        this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES = SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_YES.toString();
        this.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO = SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO.toString();
        this.WHETHER_ULTRAVIOLET_LAMP_WORKING_YES = WHETHER_ULTRAVIOLET_LAMP_WORKING_YES.toString();
        this.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO = WHETHER_ULTRAVIOLET_LAMP_WORKING_NO.toString();
        this.CCTV_SYSTEM_IS_WORKING_YES = CCTV_SYSTEM_IS_WORKING_YES.toString();
        this.CCTV_SYSTEM_IS_WORKING_NO = CCTV_SYSTEM_IS_WORKING_NO.toString();
        this.CASH_COUNTING_MACHINE_WORKING_YES = CASH_COUNTING_MACHINE_WORKING_YES.toString();
        this.CASH_COUNTING_MACHINE_WORKING_NO = CASH_COUNTING_MACHINE_WORKING_NO.toString();
        this.NOTE_SORTING_MACHINE_WORKING_YES = NOTE_SORTING_MACHINE_WORKING_YES.toString();
        this.NOTE_SORTING_MACHINE_WORKING_NO = NOTE_SORTING_MACHINE_WORKING_NO.toString();
        this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES = WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_YES.toString();
        this.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO = WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO.toString();
        this.PHYSICAL_CASH_IN_ATM_VERIFIED_YES = PHYSICAL_CASH_IN_ATM_VERIFIED_YES.toString();
        this.PHYSICAL_CASH_IN_ATM_VERIFIED_NO = PHYSICAL_CASH_IN_ATM_VERIFIED_NO.toString();
        this.WHETHERMACHINESORTEDNOTESYES = WHETHERMACHINESORTEDNOTESYES.toString();
        this.WHETHERMACHINESORTEDNOTESNO = WHETHERMACHINESORTEDNOTESNO.toString();
        this.WHETHERAVAITABITITYOFNAMYES = WHETHERAVAITABITITYOFNAMYES.toString();
        this.WHETHERAVAITABITITYOFNAMNO = WHETHERAVAITABITITYOFNAMNO.toString();
        this.WHETHERFIRYES = WHETHERFIRYES.toString();
        this.WHETHERFIRNO = WHETHERFIRNO.toString();
        this.MONTHTYCONSOTIDATEDREPORTYES = MONTHTYCONSOTIDATEDREPORTYES.toString();
        this.MONTHTYCONSOTIDATEDREPORTNO = MONTHTYCONSOTIDATEDREPORTNO.toString();
      },
      (error: any) => {
        console.log('error', error);
      }
    )

  }
  //Branch SCV report-VIEW(DYRH)
  showAnnexure2(item: any, SV_BRANCH_CODE: string) {
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let current = currentUser;
    this._persistanceService.setSessionStorage('ref_no', item.AnnexureOneData.REF_NO);
    //this.showForm = true;
    this.paramName = SV_BRANCH_CODE;
    //this.checkDetailsExixst();
    this._persistanceService.setSessionStorage('branch_code', { data: item.AnnexureOneData.SV_BRANCH_CODE });
    this.surprisecash.checkAnnexureTwoDetailsByBranchCode(item.AnnexureTwoData.REF_NO).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        if (decryptData.SV_BRANCH_CODE == SV_BRANCH_CODE && decryptData.IS_DISABLE == "Y") {
          this.annexureTwoForm.controls['NameOfInspectingOfficer'].setValue(decryptData.NAME_OF_INSPECTING_OFFICER)
          this.annexureTwoForm.controls['NameOfBranch'].setValue(decryptData.NAME_OF_BRANCH)
          // this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(decryptData.DATE_OF_PREV_SURPRISE_VERIFICATION)
          this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(this.getLatestSurpriseDate(decryptData.SV_BRANCH_CODE))
          this.annexureTwoForm.controls['OpeningClosingOfBusiness'].setValue(decryptData.OPENING_CLOSING_OF_BUSINESS)
          this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue(decryptData.OPENING_CLOSING_OF_BUSINESS_AMOUNT)
          this.annexureTwoForm.controls['SafeCustodyReceipt'].setValue(decryptData.SAFE_CUSTODY_RECEIPT)
          this.annexureTwoForm.controls['SafeCustodyReceiptDated'].setValue(decryptData.SAFE_CUSTODY_RECEIPT_DATED)
          this.annexureTwoForm.controls['StampedAgreementForms'].setValue(decryptData.STAMPED_AGREEMENT_FORMS)
          this.annexureTwoForm.controls['StampedAgreementFormsAmount'].setValue(decryptData.STAMPED_AGREEMENT_FORMS_AMOUNT)
          this.annexureTwoForm.controls['NoOfPostParcelsHeldByBranch'].setValue(decryptData.NO_OF_POST_PARCELS_HELD_BY_BRANCH)
          this.annexureTwoForm.controls['PostParcelsHeldByBranch'].setValue(decryptData.POST_PARCELS_HELD_BY_BRANCH)
          this.annexureTwoForm.controls['PostalStamps'].setValue(decryptData.POSTAL_STAMPS)
          this.annexureTwoForm.controls['PostalStampsAmount'].setValue(decryptData.POSTAL_STAMPS_AMOUNT)
          this.annexureTwoForm.controls['MonthlyCashVerification'].setValue(decryptData.MONTHLY_CASH_VERIFICATION_OF_CASH)
          this.annexureTwoForm.controls['PeriodicalSurpriseCheck'].setValue(decryptData.PERIODICAL_SURPRISE_CHECK)
          this.annexureTwoForm.controls['KeptUnderJointCustody'].setValue(decryptData.KEPT_UNDER_JOINT_CUSTODY)
          this.annexureTwoForm.controls['JointCustodianVerifying'].setValue(decryptData.JOINT_CUSTODIAN_VERIFYING)
          this.annexureTwoForm.controls['OtherGuidelinesCompiled'].setValue(decryptData.OTHER_GUIDELINES_COMPILED)
          this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustody'].setValue(decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY)
          this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintained'].setValue(decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED)
          this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeys'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS)
          this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysDate'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE)
          this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockers'].setValue(decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS)
          this.annexureTwoForm.controls['SafetySecurityFoundThatStoringRoomDoorOfBranch'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH)
          this.annexureTwoForm.controls['SafetySecurityFoundThatDoorOfNetworkRoom'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM)
          this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystem'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM)
          this.annexureTwoForm.controls['WhetherUltravioletLampProvided'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED)
          this.annexureTwoForm.controls['WhetherUltravioletLampWorking'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING)
          this.annexureTwoForm.controls['CCTVSystemIsProvided'].setValue(decryptData.CCTV_SYSTEM_IS_PROVIDED)
          this.annexureTwoForm.controls['CCTVSystemIsWorking'].setValue(decryptData.CCTV_SYSTEM_IS_WORKING)
          this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailable'].setValue(decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE)
          this.annexureTwoForm.controls['CashCountingMachineProvided'].setValue(decryptData.CASH_COUNTING_MACHINE_PROVIDED)
          this.annexureTwoForm.controls['CashCountingMachineWorking'].setValue(decryptData.CASH_COUNTING_MACHINE_WORKING)
          this.annexureTwoForm.controls['NoteSortingMachineProvided'].setValue(decryptData.NOTE_SORTING_MACHINE_PROVIDED)
          this.annexureTwoForm.controls['NoteSortingMachineWorking'].setValue(decryptData.NOTE_SORTING_MACHINE_WORKING)
          this.annexureTwoForm.controls['SecurityGuardIsInvolved'].setValue(decryptData.SECURITY_GUARD_IS_INVOLVED)
          this.annexureTwoForm.controls['SecurityGuardIsInvolvedDetails'].setValue(decryptData.SECURITY_GUARD_IS_INVOLVED_DETAILS)
          this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCash'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH)
          this.annexureTwoForm.controls['PhysicalCashInAtmVerified'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED)
          this.annexureTwoForm.controls['Discrepancies'].setValue(decryptData.DISCREPANCIES)
          this.showDescDiv = true;
          if (this.annexureTwoForm.get('Discrepancies')?.value == null) {
            this.showDescDiv = false;
            this.annexureTwoForm.controls['SelectDesc'].setValue("No")
          }
          else {
            this.showDescDiv = true;
            this.annexureTwoForm.controls['SelectDesc'].setValue("Yes")
          }
          this.annexureTwoForm.controls['Notes2000'].setValue(decryptData.NOTES_2000)
          this.annexureTwoForm.controls['Notes500'].setValue(decryptData.NOTES_500)
          this.annexureTwoForm.controls['Notes200'].setValue(decryptData.NOTES_200)
          this.annexureTwoForm.controls['Notes100'].setValue(decryptData.NOTES_100)
          this.annexureTwoForm.controls['Notes50'].setValue(decryptData.NOTES_50)
          this.annexureTwoForm.controls['Notes20'].setValue(decryptData.NOTES_20)
          this.annexureTwoForm.controls['Notes10'].setValue(decryptData.NOTES_10)
          this.annexureTwoForm.controls['Notes5'].setValue(decryptData.NOTES_5)
          this.annexureTwoForm.controls['Notes2'].setValue(decryptData.NOTES_2)
          this.annexureTwoForm.controls['Notes1'].setValue(decryptData.NOTES_1)
          this.annexureTwoForm.controls['Coins20'].setValue(decryptData.COINS_20)
          this.annexureTwoForm.controls['Coins10'].setValue(decryptData.COINS_10)
          this.annexureTwoForm.controls['Coins5'].setValue(decryptData.COINS_5)
          this.annexureTwoForm.controls['Coins2'].setValue(decryptData.COINS_2)
          this.annexureTwoForm.controls['Coins1'].setValue(decryptData.COINS_1)
          this.annexureTwoForm.controls['Coins50Paisa'].setValue(decryptData.COINS_50_PAISA)
          this.annexureTwoForm.controls['SafeCustodyReceiptName'].setValue(decryptData.SAFE_CUSTODY_RECEIPTNAME)
          this.annexureTwoForm.controls['SoiledNotesAmt'].setValue(decryptData.SOILED_NOTES_AMT)
          this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustodyNo'].setValue(decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO)
          this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintainedNo'].setValue(decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO)
          this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysNo'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO)
          this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockersNo'].setValue(decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO)
          this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystemNo'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO)
          this.annexureTwoForm.controls['WhetherUltravioletLampProvidedNo'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO)
          this.annexureTwoForm.controls['WhetherUltravioletLampWorkingNo'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO)
          this.annexureTwoForm.controls['CCTVSystemIsProvidedNo'].setValue(decryptData.CCTV_SYSTEM_IS_PROVIDED_NO)
          this.annexureTwoForm.controls['CCTVSystemIsWorkingNo'].setValue(decryptData.CCTV_SYSTEM_IS_WORKING_NO)
          this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailableNo'].setValue(decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO)
          this.annexureTwoForm.controls['CashCountingMachineProvidedNo'].setValue(decryptData.CASH_COUNTING_MACHINE_PROVIDED_NO)
          this.annexureTwoForm.controls['CashCountingMachineWorkingNo'].setValue(decryptData.CASH_COUNTING_MACHINE_WORKING_NO)
          this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCashDate'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_DATE)
          this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCashNo'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO)
          this.annexureTwoForm.controls['PhysicalCashInAtmVerifiedDate'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED_DATE)
          this.annexureTwoForm.controls['PhysicalCashInAtmVerifiedNo'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED_NO)
          this.annexureTwoForm.controls['ActionTakenBranchHead'].setValue(decryptData.ACTION_TAKEN_BY_BRANCH)
          this.annexureTwoForm.controls['ActionTakenROHead'].setValue(decryptData.ACTION_TAKEN_BY_RO)
          this.annexureTwoForm.controls['ActionTakenZOHead'].setValue(decryptData.ACTION_TAKEN_BY_ZO)
          this.annexureTwoForm.controls['ActionTakenCOHead'].setValue(decryptData.ACTION_TAKEN_BY_CO)

          this.annexureTwoForm.controls['WhetherMachineSortedNotes'].setValue(decryptData.WHETHERMACHINESORTEDNOTES)
          this.annexureTwoForm.controls['WhetherMachineSortedNotesNo'].setValue(decryptData.WHETHERMACHINESORTEDNOTESNO)
          this.annexureTwoForm.controls['WhetherAvaitabitityofNAM'].setValue(decryptData.WHETHERAVAITABITITYOFNAM)
          this.annexureTwoForm.controls['WhetherAvaitabitityofNAMNo'].setValue(decryptData.WHETHERAVAITABITITYOFNAMNO)
          this.annexureTwoForm.controls['WhetherFIR'].setValue(decryptData.WHETHERFIR)
          this.annexureTwoForm.controls['WhetherFIRNo'].setValue(decryptData.WHETHERFIRNO)
          this.annexureTwoForm.controls['MonthlyConsotidatedReport'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORT)
          this.annexureTwoForm.controls['MonthlyConsotidatedReportNo'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORTNO)
          this.annexureTwoForm.controls['cashSelectionType'].setValue(decryptData.CASH_SELECTION_TYPE);

          this.Total2000Amount = decryptData.NOTES_2000 * 2000;
          this.Total500Amount = decryptData.NOTES_500 * 500;
          this.Total200Amount = decryptData.NOTES_200 * 200;
          this.Total100Amount = decryptData.NOTES_100 * 100;
          this.Total50Amount = decryptData.NOTES_50 * 50;
          this.Total20Amount = decryptData.NOTES_20 * 20;
          this.Total10Amount = decryptData.NOTES_10 * 10;
          this.Total5Amount = decryptData.NOTES_5 * 5;
          this.Total2Amount = decryptData.NOTES_2 * 2;
          this.Total1Amount = decryptData.NOTES_1 * 1;
          this.Total20AmountCoins = decryptData.COINS_20 * 20;
          this.Total10AmountCoins = decryptData.COINS_10 * 10;
          this.Total5AmountCoins = decryptData.COINS_5 * 5;
          this.Total2AmountCoins = decryptData.COINS_2 * 2;
          this.Total1AmountCoins = decryptData.COINS_1 * 1;
          this.Total50PaisaAmountCoins = decryptData.COINS_50_PAISA * 0.50;

          this.calculateTotalSum();
          if (decryptData.ANNEXURE_STATUS_RO == "Complied By RO") {
            this.showForm = true;

            this.showRejectbutton = false;
            this.showApprovedbutton = false;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.ShowBranchAction = true;
            this.showbutton = false;
            this.ShowROAction = true;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.ZOCompliedButton = false;
            this.ZONotCompliedButton = false;
            this.ShowCOAction = true;
            this.COCompliedButton = false;
            this.ShowZOAction = true;
          }
          //Business team Issue fix- CO
          else if (decryptData.ANNEXURE_STATUS_CO == "Complied By CO") {
            this.showbutton = false;
            this.showForm = true;

            this.ShowROAction = true;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            this.ShowZOAction = true;
            this.ZOCompliedButton = false;
            this.ZONotCompliedButton = false;
            this.ShowCOAction = true;
            this.COCompliedButton = false;
            this.showRejectbutton = false;
            this.showApprovedbutton = false;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
          }
          //Business team Issue fix- CO
          else if (decryptData.ANNEXURE_STATUS_ZO == "Not Complied By ZO" && decryptData.ACTION_TAKEN_ZO_ID != current) {
            this.showbutton = false;
            this.showForm = true;

            this.ShowROAction = true;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            this.showApprovedbutton = false;
            this.showRejectbutton = false;
            if (decryptData.ANNEXURE_STATUS_ZO == "Complied By ZO") {
              this.ShowCOAction = false;
            }
            else if (decryptData.ANNEXURE_STATUS_ZO == "Not Complied By ZO") {
              this.ShowZOAction = true;
              this.ZOCompliedButton = false;
              this.ZONotCompliedButton = false;
              this.ShowCOAction = true;
              this.COCompliedButton = true;
              // this.annexureTwoForm.get('ActionTakenCOHead')?.enable();
            }

            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('ActionTakenCOHead')?.enable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
          }
          else if (decryptData.ANNEXURE_STATUS_ZO == "Not Complied By ZO") {
            this.showForm = true;
            this.showbutton = false;
            this.ShowBranchAction = true;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.ShowROAction = true;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            this.ShowZOAction = true;
            this.ZOCompliedButton = false;
            this.ZONotCompliedButton = false;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.ShowCOAction = false;
          }
          //Business team issue fix
          else if (decryptData.ANNEXURE_STATUS_ZO == "Complied By ZO" && decryptData.ACTION_TAKEN_ZO_ID == current) {
            this.showForm = true;
            this.annexureTwoForm.disable();
            this.ShowROAction = true;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            this.ShowZOAction = true;
            this.ZOCompliedButton = false;
            this.ZONotCompliedButton = false;
            this.showbutton = false;
            // this.annexureTwoForm.get('ActionTakenZOHead')?.enable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.ShowCOAction = true;
            this.COCompliedButton = false;
          }
          else if (decryptData.ANNEXURE_STATUS_RO == "Not Complied By RO" && decryptData.ACTION_TAKEN_RO_ID != current) {
            this.showbutton = false;
            this.showForm = true;

            this.ShowROAction = true;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            if (decryptData.ANNEXURE_STATUS_RO == "Complied By RO") {
              this.ShowZOAction = false;
            }
            else if (decryptData.ANNEXURE_STATUS_RO == "Not Complied By RO") {
              this.ShowZOAction = true;
              this.ZOCompliedButton = true;
              this.ZONotCompliedButton = true;
              this.ShowCOAction = false;
            }

            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('ActionTakenZOHead')?.enable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
          }
          else if (decryptData.ANNEXURE_STATUS_BRANCH == "Scrutinized" && decryptData.ACTION_TAKEN_BRANCH_ID == current) {
            this.showForm = true;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.showbutton = false;
            this.ShowROAction = true;
            this.annexureTwoForm.get('ActionTakenROHead')?.enable();
          }
          //Business team issue fix
          else if (decryptData.ANNEXURE_STATUS_RO == "Not Complied By RO" && decryptData.ACTION_TAKEN_RO_ID == current) {
            this.showRejectbutton = false;
            this.showApprovedbutton = false;
            this.showbutton = false;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.showForm = true;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.ShowBranchAction = true;
            this.ShowROAction = true;
            this.ROCompliedButton = false;
            this.RONotCompliedButton = false;
            this.ShowZOAction = true;
            this.ZOCompliedButton = false;
            this.ZONotCompliedButton = false;
            this.ShowCOAction = true;
            this.COCompliedButton = false;
          }
          else if (decryptData.ANNEXURE_STATUS == "Approved") {
            this.showRejectbutton = false;
            this.showApprovedbutton = false;
            this.showbutton = false;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.showForm = true;
            this.ShowBranchAction = true;
            this.ShowROAction = true;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('ActionTakenROHead')?.enable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.ShowZOAction = false;
            this.ShowCOAction = false;
            this.ROCompliedButton = true;
            this.RONotCompliedButton = true;
          }
          else if (decryptData.ANNEXURE_STATUS == "Rejected") {
            this.showRejectbutton = false;
            this.showApprovedbutton = false;
            this.showbutton = false;
          }
          else {
            this.showRejectbutton = true;
            this.showApprovedbutton = true;
            this.showbutton = false;
            this.BranchCompliedButton = false;
            this.BranchNotCompliedButton = false;
            this.showForm = true;
            this.ShowBranchAction = false;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.ShowROAction = false;
            this.ShowZOAction = false;
            this.ShowCOAction = false;
          }
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    )

    this.showForm = false;

  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`
  }

  getUserInfoByPfNo() {
    let current = this.loginservice.encryptstring(this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER_LOGIN)));

    this.surprisecash.getUserDataBypf(current).subscribe((response: any) => {
      if (response.status == 'success') {
        let responseData = JSON.parse(this.loginservice.decryptData(response.rData))
        let decryptData = responseData.StaffDetails;
        console.log(decryptData);

        this._persistanceService.setSessionStorage(LocalStorageVariable.CURRENT_USER, decryptData.EMP_ID);

        this._persistanceService.setSessionStorage('emp_desgn_code', decryptData.EMP_DESGN);
        this._persistanceService.setSessionStorage('region_code', decryptData.REGION_CODE);
        this._persistanceService.setSessionStorage('region_name', decryptData.REGION_NAME);
        this._persistanceService.setSessionStorage('zone_code', decryptData.DIVISION_CODE);
        this._persistanceService.setSessionStorage('zone_name', decryptData.DIVISION_NAME);
        this._persistanceService.setSessionStorage('emp_name', decryptData.EMP_NAME);
        this._persistanceService.setSessionStorage('FINANCIAL_YEAR', decryptData.FINANCIAL_YEAR);
        this._persistanceService.setSessionStorage('QUATER', decryptData.QUATER);
        this._persistanceService.setSessionStorage('location', decryptData.LOCATION);
        this._persistanceService.setSessionStorage('location_desc', decryptData.LOCATION_DESC);
        this._persistanceService.setSessionStorage('Emp_Scale_Descr', decryptData.EMP_SCALE_DESCR);



        this.annexureOneForm.controls['LoggedUserId'].setValue(this.loginservice.decryptData(decryptData.EMP_ID))
        this.annexureOneForm.controls['FromDyrhName'].setValue(decryptData.EMP_NAME)
        this.annexureOneForm.controls['ZoneName'].setValue(decryptData.DIVISION_NAME)
        this.annexureOneForm.controls['ZoneCode'].setValue(decryptData.DIVISION_CODE)
        this.annexureOneForm.controls['FromRegionHead'].setValue(decryptData.EMP_NAME)
        this.annexureOneForm.controls['FromRegionName'].setValue(decryptData.REGION_NAME)
        const officersArray = this.getOfficersFormArray;
        officersArray.controls.map((control: AbstractControl) => {
          control.get('FromRegionHead')?.setValue(decryptData.EMP_NAME)
          control.get('FromRegionName2')?.setValue(decryptData.REGION_NAME)

        });
        // this.annexureOneForm.controls['FromRegionName'].setValue(decryptData.REGION_NAME)
        this.annexureOneForm.controls['RegionCode'].setValue(decryptData.REGION_CODE)
        this.annexureThreeForm.controls['RegionalHead'].setValue(responseData.RegionalHead);
        this.getBranchByZoneRegion(decryptData.DIVISION_CODE, decryptData.REGION_CODE);
        const officerScales = [
          'SCALE 4 OFFICER',
          'SCALE 5 OFFICER',
          'SCALE 6 OFFICER',
          'SCALE 7 OFFICER',
          'SCALE 8 OFFICER'
        ];
        if (decryptData.LOCATION_DESC?.startsWith('RO') && officerScales.includes(decryptData.EMP_SCALE_DESCR)) {
          console.log("Yes RO");
          this.checkAnnexureByRegionCode(decryptData.REGION_CODE);
          this.checkAnnexureThree(decryptData.REGION_CODE, '', 'No');
          this.checkAnnexureTwoGrid();
          this.showAnnexure1Form = true;
          this.ShowBranchAction = true;
          this.ShowZoneDDL = false;
          this.ShowRegionDDL = false;

          this.ShowAnnexure1Button = true;
          this.ShowAnnexure2Button = true;
          this.ShowAnnexure3Button = true;
          this.ShowAnnexure5Button = true;
          this.ShowAnnexure7Button = true;
          this.annexureThreeForm.controls['ZonalOffice3'].setValue(decryptData.DIVISION_NAME);
          this.annexureThreeForm.controls['RegionalOffice'].setValue(decryptData.REGION_NAME);
        }
        else if (decryptData.LOCATION_DESC?.startsWith('ZO') && officerScales.includes(decryptData.EMP_SCALE_DESCR)) {
          console.log("Yes ZO");
          let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
          this.checkAnnexureByZoneCode(decryptData.DIVISION_CODE, currentQuarter);
          this.checkAnnexureByCO(decryptData.DIVISION_CODE);
          this.ShowAnnexure2Button = true;
          this.ShowAnnexure4Button = true;
          this.ShowAnnexure5Button = true;

          this.showAnnexure2Form = true;
          this.ShowBranchAction = true;
          this.ShowZoneDDL = false;
          this.ShowZoneDropDown = false;
          this.ShowRegionDropDown = true;
          this.fillRegionData(decryptData.DIVISION_CODE);
        }
        else {
          console.log("Yes else")
          this.surprisecash.getLogInType(decryptData.EMP_DESGN).subscribe((response: any) => {
            if (response.status == 'success' && response.rData?.status == 'Allow') {
              // console.log("First");
              const data = response.rData;
              // console.log(data);
              const userType = data.useR_TYPE;
              const status = data.status;
              this.handleLogin(userType, status, decryptData.LOCATION, decryptData.DIVISION_CODE, decryptData.DIVISION_NAME, decryptData.REGION_CODE, decryptData.REGION_NAME);
            }
            else {
              const empId = this.loginservice.decryptData(decryptData.EMP_ID);
              this.surprisecash.getCOLogIn(decryptData.LOCATION, empId).subscribe((response: any) => {
                if (response.status == 'success' && response.rData?.status == 'Allow') {
                  // console.log("CO");
                  const data = response.rData;
                  // console.log(data);
                  const userType = data.useR_TYPE;
                  const status = data.status;
                  this.handleLogin(userType, status, decryptData.LOCATION, decryptData.DIVISION_CODE, decryptData.DIVISION_NAME, decryptData.REGION_CODE, decryptData.REGION_NAME);
                }
                else {
                  // console.log("IO");
                  this.IOLogin();
                }
              });
            }
          });
        }

      }
    })
  }
  private handleLogin(userType: string, status: string, location: string, divisionCode: string, divisionName: string, regionCode: string, regionName: string) {
    switch (userType) {
      case 'BH':
        console.log('BH');
        this.checkAnnexureOneDetailsBySVBranchCode(location);//Branch SCV report
        this.showAnnexure2Form = true;
        break;
      case 'CO':
        console.log('CO');
        this.checkAnnexureTwoGridCO();
        this.showAnnexure4Form = true;
        this.ShowZoneDropDown = true;
        this.ShowDiscrepanciesFourForm = false;
        this.ShowAnnexure4Button = true;
        this.ShowAnnexure5Button = true;
        this.ShowAnnexure6Button = true;
        this.ShowAnnexure2Button = true;
        this.annexureFourForm.controls['ZonalOffice4'].setValue(divisionName);
        break;
      case 'DYRH':
        console.log('DYRH');
        this.checkAnnexureByRegionCode(regionCode);//Discrepancies Report of region
        this.checkAnnexureThree(regionCode, '', 'No');//Consolidated Report of RO
        this.checkAnnexureTwoGrid();//Branch SCV report-DYRH
        this.showAnnexure1Form = true;
        this.ShowBranchAction = true;
        this.ShowZoneDDL = false;
        this.ShowRegionDDL = false;
        // this.showAnnexure2details = false;

        //showing button based on login user
        this.ShowAnnexure1Button = true;
        this.ShowAnnexure2Button = true;
        this.ShowAnnexure3Button = true;
        this.ShowAnnexure5Button = true;
        this.ShowAnnexure7Button = true;
        this.annexureThreeForm.controls['ZonalOffice3'].setValue(divisionName);
        this.annexureThreeForm.controls['RegionalOffice'].setValue(regionName);
        //this.getBranchData();
        break;
      case 'ZO':
        console.log('ZO');
        let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
        this.checkAnnexureByZoneCode(divisionCode, currentQuarter);//Discrepancies Report BY Zone & Quarter
        //this.checkAnnexureThree(decryptData.DIVISION_CODE, '', 'Yes');
        this.checkAnnexureByCO(divisionCode);//Branch SCV report 
        this.ShowAnnexure2Button = true;
        this.ShowAnnexure4Button = true;
        this.ShowAnnexure5Button = true;

        this.showAnnexure2Form = true;
        this.ShowBranchAction = true;
        this.ShowZoneDDL = false;
        this.ShowZoneDropDown = false;
        this.ShowRegionDropDown = true;
        this.fillRegionData(divisionCode);
        break;
    }
  }
  private IOLogin() {
    console.log('IO');
    this.checkAnnexureOneDetailsByPFno();
    this.showAnnexure1Form = false;
    this.showAnnexure2Form = true;
    this.ShowBranchAction = false;
  }
  exportData(): void {
    this.excelService.exportTableToExcel('tableData', 'Annexure-V')
  }

  onChangeZone(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).selectedIndex].text;
    const target = event.target as HTMLInputElement;
    this.checkAnnexureFour(target.value, 'Yes', this.annexureFourForm.get('YearFour')?.value, this.annexureFourForm.get('QuaterFour')?.value);
    this.getAnnexureFourDetail(target.value);
    this.fillRegionData(target.value);
    this.annexureFourForm.controls['ZonalHead4'].setValue(selectedName);
    this.annexureFourForm.controls['ZonalOffice4'].setValue(selectedName);
  }

  onChangeQuaterThree(event: Event) {
    const target = event.target as HTMLInputElement;
    let loginzonecode = this._persistanceService.getSessionStorage('zone_code');
    let loginregioncode = this._persistanceService.getSessionStorage('region_code');
    this.checkAnnexureThree(loginregioncode, target.value, 'No');
  }

  onZoneChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fillRegionData(target.value);

    //this.checkAnnexureByZoneCode(target.value,"");

  }

  onRegionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checkAnnexureByRegionCode(target.value);
  }

  onRegionChangeAnnexure5(event: Event) {
    const target = event.target as HTMLInputElement;
    var FinancialYear = this.annexureFiveForm.get('FinancialYearFive')?.value;
    var Quater = this.annexureFiveForm.get('QuaterFive')?.value;

    this.checkAnnexureByRegionCodeQuater(FinancialYear, Quater);
  }

  onQuaterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    var FinancialYear = this.annexureFiveForm.get('FinancialYearFive')?.value;
    var Quater = this.annexureFiveForm.get('QuaterFive')?.value;

    this.checkAnnexureByRegionCodeQuater(FinancialYear, Quater);
  }
  // onQuaterChangeTwo(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   var FinancialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
  //   var Quater = this.annexureTwoForm.get('QuaterTwo')?.value;
  //   let loginzonecode = this._persistanceService.getSessionStorage('zone_code');

  //   this.checkAnnexureTwoDetailsByCO(loginzonecode, FinancialYear, Quater);
  // }
  onQuaterChangeSeven(event: Event) {
    const target = event.target as HTMLInputElement;
    var FinancialYear = this.annexureSevenForm.get('FinancialYearSeven')?.value;
    var Quater = this.annexureSevenForm.get('QuaterSeven')?.value;
    var regionCode = this._persistanceService.getSessionStorage('region_code');
    var divisionCode = this._persistanceService.getSessionStorage('zone_code');
    this.getBranchData(FinancialYear, Quater, regionCode, divisionCode);
  }
  onRegionChangeAnnexure4(event: Event) {
    const target = event.target as HTMLInputElement;
    //this.checkAnnexureByRegionCode(target.value);
    this.checkAnnexureFour(target.value, 'No', this.annexureFourForm.get('YearFour')?.value, this.annexureFourForm.get('QuaterFour')?.value);

    const selectedName = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).selectedIndex].text;
    this.annexureFourForm.controls['ZonalHead4'].setValue(selectedName);
    this.annexureFourForm.controls['ZonalOffice4'].setValue(selectedName);
  }

  fillRegionData(zonecode: string) {
    this.surprisecash.BindRegionDetails(zonecode).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.data = decryptData;
        this.annexureTwoForm.controls['ddlRegionName'].setValue(decryptData.REGION_CODE);
      },
      (error: any) => {
        console.log('error', error);
      }
    )

  }

  checkDetailsExixst() {

    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let current: string;
    if (this.paramName != null) {
      current = this.paramName;
    }
    else {
      current = currentUser;
    }
    //let current = currentUser;
    if (current) {

      this.surprisecash.checkDetailsExist(current).subscribe(
        (response: any) => {
          let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
          // console.log('decryptData', decryptData);
          this.annexureTwoForm.controls['NameOfInspectingOfficer'].setValue(decryptData.AnnexureTwoData.NAME_OF_INSPECTING_OFFICER)
          this.annexureTwoForm.controls['NameOfBranch'].setValue(decryptData.AnnexureTwoData.NAME_OF_BRANCH)
          this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(decryptData.AnnexureTwoData.DATE_OF_PREV_SURPRISE_VERIFICATION)
          this.annexureTwoForm.controls['OpeningClosingOfBusiness'].setValue(decryptData.AnnexureTwoData.OPENING_CLOSING_OF_BUSINESS)
          this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue(decryptData.AnnexureTwoData.OPENING_CLOSING_OF_BUSINESS_AMOUNT)
          this.annexureTwoForm.controls['SafeCustodyReceipt'].setValue(decryptData.AnnexureTwoData.SAFE_CUSTODY_RECEIPT)
          this.annexureTwoForm.controls['SafeCustodyReceiptDated'].setValue(decryptData.AnnexureTwoData.SAFE_CUSTODY_RECEIPT_DATED)
          this.annexureTwoForm.controls['StampedAgreementForms'].setValue(decryptData.AnnexureTwoData.STAMPED_AGREEMENT_FORMS)
          this.annexureTwoForm.controls['StampedAgreementFormsAmount'].setValue(decryptData.AnnexureTwoData.STAMPED_AGREEMENT_FORMS_AMOUNT)
          this.annexureTwoForm.controls['NoOfPostParcelsHeldByBranch'].setValue(decryptData.AnnexureTwoData.NO_OF_POST_PARCELS_HELD_BY_BRANCH)
          this.annexureTwoForm.controls['PostParcelsHeldByBranch'].setValue(decryptData.AnnexureTwoData.POST_PARCELS_HELD_BY_BRANCH)
          this.annexureTwoForm.controls['PostalStamps'].setValue(decryptData.AnnexureTwoData.POSTAL_STAMPS)
          this.annexureTwoForm.controls['PostalStampsAmount'].setValue(decryptData.AnnexureTwoData.POSTAL_STAMPS_AMOUNT)
          this.annexureTwoForm.controls['MonthlyCashVerification'].setValue(decryptData.AnnexureTwoData.MONTHLY_CASH_VERIFICATION_OF_CASH)
          this.annexureTwoForm.controls['PeriodicalSurpriseCheck'].setValue(decryptData.AnnexureTwoData.PERIODICAL_SURPRISE_CHECK)
          this.annexureTwoForm.controls['KeptUnderJointCustody'].setValue(decryptData.AnnexureTwoData.KEPT_UNDER_JOINT_CUSTODY)
          this.annexureTwoForm.controls['JointCustodianVerifying'].setValue(decryptData.AnnexureTwoData.JOINT_CUSTODIAN_VERIFYING)
          this.annexureTwoForm.controls['OtherGuidelinesCompiled'].setValue(decryptData.AnnexureTwoData.OTHER_GUIDELINES_COMPILED)
          this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustody'].setValue(decryptData.AnnexureTwoData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY)
          this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintained'].setValue(decryptData.AnnexureTwoData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED)
          this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeys'].setValue(decryptData.AnnexureTwoData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS)
          this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysDate'].setValue(decryptData.AnnexureTwoData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE)
          this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockers'].setValue(decryptData.AnnexureTwoData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS)
          this.annexureTwoForm.controls['SafetySecurityFoundThatStoringRoomDoorOfBranch'].setValue(decryptData.AnnexureTwoData.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH)
          this.annexureTwoForm.controls['SafetySecurityFoundThatDoorOfNetworkRoom'].setValue(decryptData.AnnexureTwoData.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM)
          this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystem'].setValue(decryptData.AnnexureTwoData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM)
          this.annexureTwoForm.controls['WhetherUltravioletLampProvided'].setValue(decryptData.AnnexureTwoData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED)
          this.annexureTwoForm.controls['WhetherUltravioletLampWorking'].setValue(decryptData.AnnexureTwoData.WHETHER_ULTRAVIOLET_LAMP_WORKING)
          this.annexureTwoForm.controls['CCTVSystemIsProvided'].setValue(decryptData.AnnexureTwoData.CCTV_SYSTEM_IS_PROVIDED)
          this.annexureTwoForm.controls['CCTVSystemIsWorking'].setValue(decryptData.AnnexureTwoData.CCTV_SYSTEM_IS_WORKING)
          this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailable'].setValue(decryptData.AnnexureTwoData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE)
          this.annexureTwoForm.controls['CashCountingMachineProvided'].setValue(decryptData.AnnexureTwoData.CASH_COUNTING_MACHINE_PROVIDED)
          this.annexureTwoForm.controls['CashCountingMachineWorking'].setValue(decryptData.AnnexureTwoData.CASH_COUNTING_MACHINE_WORKING)
          this.annexureTwoForm.controls['NoteSortingMachineProvided'].setValue(decryptData.AnnexureTwoData.NOTE_SORTING_MACHINE_PROVIDED)
          this.annexureTwoForm.controls['NoteSortingMachineWorking'].setValue(decryptData.AnnexureTwoData.NOTE_SORTING_MACHINE_WORKING)
          this.annexureTwoForm.controls['SecurityGuardIsInvolved'].setValue(decryptData.AnnexureTwoData.SECURITY_GUARD_IS_INVOLVED)
          this.annexureTwoForm.controls['SecurityGuardIsInvolvedDetails'].setValue(decryptData.AnnexureTwoData.SECURITY_GUARD_IS_INVOLVED_DETAILS)
          this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCash'].setValue(decryptData.AnnexureTwoData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH)
          this.annexureTwoForm.controls['PhysicalCashInAtmVerified'].setValue(decryptData.AnnexureTwoData.PHYSICAL_CASH_IN_ATM_VERIFIED)
          this.annexureTwoForm.controls['Discrepancies'].setValue(decryptData.AnnexureTwoData.DISCREPANCIES)
          this.annexureTwoForm.controls['Notes2000'].setValue(decryptData.AnnexureTwoData.NOTES_2000)
          this.annexureTwoForm.controls['Notes500'].setValue(decryptData.AnnexureTwoData.NOTES_500)
          this.annexureTwoForm.controls['Notes200'].setValue(decryptData.AnnexureTwoData.NOTES_200)
          this.annexureTwoForm.controls['Notes100'].setValue(decryptData.AnnexureTwoData.NOTES_100)
          this.annexureTwoForm.controls['Notes50'].setValue(decryptData.AnnexureTwoData.NOTES_50)
          this.annexureTwoForm.controls['Notes20'].setValue(decryptData.AnnexureTwoData.NOTES_20)
          this.annexureTwoForm.controls['Notes10'].setValue(decryptData.AnnexureTwoData.NOTES_10)
          this.annexureTwoForm.controls['Notes5'].setValue(decryptData.AnnexureTwoData.NOTES_5)
          this.annexureTwoForm.controls['Notes2'].setValue(decryptData.AnnexureTwoData.NOTES_2)
          this.annexureTwoForm.controls['Notes1'].setValue(decryptData.AnnexureTwoData.NOTES_1)
          this.annexureTwoForm.controls['Coins20'].setValue(decryptData.AnnexureTwoData.COINS_20)
          this.annexureTwoForm.controls['Coins10'].setValue(decryptData.AnnexureTwoData.COINS_10)
          this.annexureTwoForm.controls['Coins5'].setValue(decryptData.AnnexureTwoData.COINS_5)
          this.annexureTwoForm.controls['Coins2'].setValue(decryptData.AnnexureTwoData.COINS_2)
          this.annexureTwoForm.controls['Coins1'].setValue(decryptData.AnnexureTwoData.COINS_1)
          this.annexureTwoForm.controls['Coins50Paisa'].setValue(decryptData.AnnexureTwoData.COINS_50_PAISA)
          this.annexureTwoForm.controls['SafeCustodyReceiptName'].setValue(decryptData.AnnexureTwoData.SAFE_CUSTODY_RECEIPTNAME)
          this.annexureTwoForm.controls['SoiledNotesAmt'].setValue(decryptData.AnnexureTwoData.SOILED_NOTES_AMT)
          this.showbutton = false;
          if (this.paramName != null) {
            this.showForm = true;
            this.annexureTwoForm.disable();
            this.annexureTwoForm.get('FinancialYearTwo')?.enable();
            this.annexureTwoForm.get('QuaterTwo')?.enable();
            this.showApprovedbutton = true;
            this.showRejectbutton = true;
          }
          else {
            current = currentUser;
          }
          // if (decryptData.AnnexureOneData.SV_BRANCH_CODE == decryptData.AnnexureTwoData.SV_BRANCH_CODE)
          // {
          //     this.buttonText = 'Submitted';
          // }
          // else
          // {
          //   this.buttonText = 'View';
          // }
        },
        (error: any) => {
          console.log('error', error);
        }
      )
    }

  }

  // checkAnnexureTwo() {

  //   let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
  //   let current = currentUser;
  //   if (current) {

  //     this.surprisecash.checkAnnexureTwo(current).subscribe(
  //       (response: any) => {
  //         let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
  //         this.data = decryptData;
  //         console.log(this.data);

  //       },
  //       (error: any) => {
  //         console.log('error', error);
  //       }
  //     )
  //   }

  // }


  checkAnnexureOneDetailsBySVBranchCode(svbranchcode: string) {
    let currentYear = this._persistanceService.getSessionStorage('currentFinancialYear');
    let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let current = currentUser;
    this.annexureTwoForm.patchValue({
      FinancialYearTwo: currentYear,
      QuaterTwo: currentQuarter
    });
    this.checkAnnexureOneDetailsBySVBranchCodeService(svbranchcode, current, currentYear, currentQuarter);
  }
  checkAnnexureOneDetailsBySVBranchCodeService(svbranchcode: string, current: string, financialYear: string, quarter: string) {
    let regionCode = this._persistanceService.getSessionStorage('region_code');
    this.surprisecash.checkAnnexureOneDetailsBySVBranchCode(svbranchcode, current, financialYear, quarter, regionCode).subscribe(
      (response: any) => {
        this.annexureTwoNoData = ''; //clear any previous message
        this.showAnnexure2details = false;
        this.showTable = true;

        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.data = decryptData;
        // console.log("checkAnnexureOneDetailsBySVBranchCodeService " + this.data);
        if (!this.data || this.data.length == 0) {
          this.annexureTwoNoData = `No data to display for Financial Year: ${financialYear} and Quater: ${quarter}`;
          return;
        }

        this.matchBranchesWithData();
        // console.log('BH- Branch scv report:', this.data);
        this.data.forEach(item => {

          item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By CO" ? item.labelName = "Complied By CO" :
            item.AnnexureTwoData.ANNEXURE_STATUS_ZO == "Not Complied By ZO" && item.AnnexureTwoData.ANNEXURE_STATUS_CO == null ? item.labelName = "Not Complied By ZO" :
              item.AnnexureTwoData.ANNEXURE_STATUS_ZO == "Complied By ZO" && item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By ZO" ? item.labelName = "Complied By ZO" :

                item.AnnexureTwoData.ANNEXURE_STATUS_RO == "Complied By RO" ? item.labelName = "Complied By RO" :
                  item.AnnexureTwoData.ANNEXURE_STATUS_ZO == null && item.AnnexureTwoData.ANNEXURE_STATUS_CO == null && item.AnnexureTwoData.ANNEXURE_STATUS_RO == "Not Complied By RO" ?
                    item.labelName = "Not Complied By RO" :
                    (item.AnnexureTwoData.DISCREPANCIES == null && item.AnnexureTwoData.ANNEXURE_STATUS == null) ? item.labelName = "Not Submitted" : item.AnnexureTwoData.ANNEXURE_STATUS == "Submitted-Disable" ? item.labelName = "Submitted" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" : item.AnnexureTwoData.ANNEXURE_STATUS_BRANCH == "Scrutinized" ? item.labelName = "Scrutinized" : item.AnnexureTwoData.ANNEXURE_STATUS == "Saved" ? item.labelName = "Saved" :
                      item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.labelName = "Submitted";

        });

      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }

  getAnnexureThreeDetail(code: string, iszone: string) {
    let status = "Submitted";

    this.surprisecash.getAnnexure3Details(status, code, iszone).subscribe(
      (response: any) => {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.annexureThreedata = decryptData;


        if (decryptData.length == 0) {
          this.ShowDiscrepanciesThreeForm = true;
        }
        else {
          this.ShowDiscrepanciesThreeForm = false;
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }

  checkAnnexureOneDetailsByPFno() {

    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let current = currentUser;
    let currentYear = this._persistanceService.getSessionStorage('currentFinancialYear');
    let currentQuarter = this._persistanceService.getSessionStorage('currentQuarter');
    this.annexureTwoForm.patchValue({
      FinancialYearTwo: currentYear,
      QuaterTwo: currentQuarter
    });
    if (current) {
      this.checkAnnexureOneDetailsByPFnoService(current, currentYear, currentQuarter);
    }
  }

  checkAnnexureOneDetailsByPFnoService(current: string, financialYear: string, quarter: string) {
    this.surprisecash.checkAnnexureOneDetailsByPFno(current, financialYear, quarter).subscribe(
      (response: any) => {
        this.annexureTwoNoData = ''; //clear any previous message
        this.showAnnexure2details = false;
        this.showTable = true;
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        this.data = decryptData;
        if (!this.data || this.data.length == 0) {
          this.annexureTwoNoData = `No data to display for Financial Year: ${financialYear} and Quater: ${quarter}`;
          return;
        }
        this.matchBranchesWithData();
        // console.log('IO- Branch SCV report ', this.data);

        this.data.forEach(item => {

          item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By CO" ? item.labelName = "Complied By CO" :
            item.AnnexureTwoData.ANNEXURE_STATUS_ZO == "Not Complied By ZO" && item.AnnexureTwoData.ANNEXURE_STATUS_CO == null ? item.labelName = "Not Complied By ZO" :
              item.AnnexureTwoData.ANNEXURE_STATUS_ZO == "Complied By ZO" && item.AnnexureTwoData.ANNEXURE_STATUS_CO == "Complied By ZO" ? item.labelName = "Complied By ZO" :

                item.AnnexureTwoData.ANNEXURE_STATUS_RO == "Complied By RO" ? item.labelName = "Complied By RO" :
                  item.AnnexureTwoData.ANNEXURE_STATUS_ZO == null && item.AnnexureTwoData.ANNEXURE_STATUS_CO == null && item.AnnexureTwoData.ANNEXURE_STATUS_RO == "Not Complied By RO" ?
                    item.labelName = "Not Complied By RO" :
                    (item.AnnexureTwoData.CREATED_BY != current) ? item.labelName = "Not Saved" : item.AnnexureTwoData.IS_DISABLE == "N" ? item.labelName = "Saved" : item.AnnexureTwoData.ANNEXURE_STATUS == "Rejected" ? item.labelName = "Rejected" :
                      item.AnnexureTwoData.ANNEXURE_STATUS == "Approved" ? item.labelName = "Approved" : item.labelName = "Submitted";

        });

      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }

  reject(stepper: any) {


    const branch = this._persistanceService.getSessionStorage('branch_code');
    const formData = this.annexureTwoForm.value;
    this.surprisecash.sendData(branch);
    this.showPopup = !this.showPopup;
  }

  approved(stepper: any) {
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let ModifiedBy = currentUser;
    var Status = "Approved";
    let RefNo = this._persistanceService.getSessionStorage('ref_no');
    let BranchCode = this._persistanceService.getSessionStorage('branch_code');
    let SVBranchCode = BranchCode.data;
    const postData = { Status, ModifiedBy, SVBranchCode, RefNo }

    this.surprisecash.addApproved(postData).subscribe((response: any) => {
      if (response.status == 'success') {
        //this.showModal = false;
        this.formSubmitted = true;
        this.annexureTwoForm.disable();
        this.annexureTwoForm.get('FinancialYearTwo')?.enable();
        this.annexureTwoForm.get('QuaterTwo')?.enable();
        this.notifier.success(response.message);
        //stepper.next();
        //this.checkAnnexureTwoGrid();
        window.location.reload();
      } else {
        this.notifier.error(response.message);
      }
    })
  }

  BranchComplied(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let ActionTakenBranchId = currentUser;
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      var AnnexureStatusBranch = "Scrutinized";
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let SVBranchCode = BranchCode.data;
      let ActionTakenByBranch = this.annexureTwoForm.get('ActionTakenBranchHead')?.value;
      const postData = { ActionTakenByBranch, ActionTakenBranchId, AnnexureStatusBranch, SVBranchCode, RefNo }
      this.surprisecash.BranchComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.BranchCompliedButton = false;
          this.BranchNotCompliedButton = false;
          this.notifier.success(response.message);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  BranchNotComplied(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let ActionTakenBranchId = currentUser;
      var AnnexureStatusBranch = "No";
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let SVBranchCode = BranchCode.data;
      var ActionTakenByBranch = this.annexureTwoForm.get('ActionTakenBranchHead')?.value;
      const postData = { ActionTakenByBranch, ActionTakenBranchId, AnnexureStatusBranch, SVBranchCode, RefNo }
      this.surprisecash.BranchComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.BranchCompliedButton = false;
          this.BranchNotCompliedButton = false;
          this.notifier.success(response.message);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  ROComplied(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      let ActionTakenROId = currentUser;
      var AnnexureStatusRO = "Complied By RO";
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let SVBranchCode = BranchCode.data;
      var ActionTakenByRO = this.annexureTwoForm.get('ActionTakenROHead')?.value;
      const postData = { ActionTakenByRO, ActionTakenROId, AnnexureStatusRO, SVBranchCode, RefNo }
      this.surprisecash.ROComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.ROCompliedButton = false;
          this.RONotCompliedButton = false;
          this.notifier.success(response.message);
          // let financialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
          // let quarter = this.annexureTwoForm.get('QuaterTwo')?.value;
          // this.checkAnnexureTwo(currentUser, financialYear, quarter);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  RONotComplied(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let ActionTakenROId = currentUser;
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      var AnnexureStatusRO = "Not Complied By RO";
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let SVBranchCode = BranchCode.data;
      var ActionTakenByRO = this.annexureTwoForm.get('ActionTakenROHead')?.value;
      const postData = { ActionTakenByRO, ActionTakenROId, AnnexureStatusRO, SVBranchCode, RefNo }
      this.surprisecash.ROComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.ROCompliedButton = false;
          this.RONotCompliedButton = false;
          this.notifier.success(response.message);
          // let financialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
          // let quarter = this.annexureTwoForm.get('QuaterTwo')?.value;
          // this.checkAnnexureTwo(currentUser, financialYear, quarter);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  ZOComplied(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let ActionTakenZOId = currentUser;
      var AnnexureStatusZO = "Complied By ZO";
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let SVBranchCode = BranchCode.data;
      var ActionTakenByZO = this.annexureTwoForm.get('ActionTakenZOHead')?.value;
      const postData = { ActionTakenByZO, ActionTakenZOId, AnnexureStatusZO, SVBranchCode, RefNo }
      this.surprisecash.ZOComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.ZOCompliedButton = false;
          this.ZONotCompliedButton = false;
          this.notifier.success(response.message);
          // let financialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
          // let quarter = this.annexureTwoForm.get('QuaterTwo')?.value;
          // this.checkAnnexureTwo(currentUser, financialYear, quarter);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  ZONotComplied(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let ActionTakenZOId = currentUser;
      var AnnexureStatusZO = "Not Complied By ZO";
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let SVBranchCode = BranchCode.data;
      var ActionTakenByZO = this.annexureTwoForm.get('ActionTakenZOHead')?.value;
      const postData = { ActionTakenByZO, ActionTakenZOId, AnnexureStatusZO, SVBranchCode, RefNo }
      this.surprisecash.ZOComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.ZOCompliedButton = false;
          this.ZONotCompliedButton = false;
          this.notifier.success(response.message);
          // let financialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
          // let quarter = this.annexureTwoForm.get('QuaterTwo')?.value;
          // this.checkAnnexureTwo(currentUser, financialYear, quarter);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  COComplied() {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let ActionTakenCOId = currentUser;
      var AnnexureStatusCO = "Complied By CO";
      let RefNo = this._persistanceService.getSessionStorage('ref_no');
      var ActionTakenByCO = this.annexureTwoForm.get('ActionTakenCOHead')?.value;
      const postData = { ActionTakenByCO, ActionTakenCOId, AnnexureStatusCO, RefNo }
      this.surprisecash.COComplied(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.COCompliedButton = false;
          this.notifier.success(response.message);
          // let financialYear = this.annexureTwoForm.get('FinancialYearTwo')?.value;
          // let quarter = this.annexureTwoForm.get('QuaterTwo')?.value;
          // this.checkAnnexureTwo(currentUser, financialYear, quarter);
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }
  //Branch SCV report -VIEW(IO,BH)
  viewAnnexure2(item: any, SV_BRANCH_CODE: string) {
    this._persistanceService.setSessionStorage('emp_name', item.AnnexureOneData.TO_BRANCH_OFFICER_NAME);
    this._persistanceService.setSessionStorage('branch_name', item.brancH_NAME);
    this._persistanceService.setSessionStorage('ref_no', item.AnnexureOneData.REF_NO);
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let current = currentUser;
    this._persistanceService.setSessionStorage('branch_code', { data: SV_BRANCH_CODE });

    this._persistanceService.setSessionStorage('Financial_Year', item.AnnexureOneData.FINANCIAL_YEAR);
    this._persistanceService.setSessionStorage('Quater', item.AnnexureOneData.QUATER);

    // this.onBOD('BOD');
    this.surprisecash.checkAnnexureTwoDetailsByBranchCode(item.AnnexureOneData.REF_NO).subscribe(
      (response: any) => {
        if (response.rData != null) {
          let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
          // console.log('checkAnnexureTwoDetailsByBranchCode', decryptData);
          if (item.AnnexureTwoData != null) {
            if (decryptData.REF_NO == item.AnnexureOneData.REF_NO && decryptData.SV_BRANCH_CODE == SV_BRANCH_CODE && decryptData.FINANCIAL_YEAR == item.AnnexureTwoData.FINANCIAL_YEAR && decryptData.QUATER == item.AnnexureTwoData.QUATER && decryptData.IS_DISABLE == "Y" && decryptData.ANNEXURE_STATUS != "Rejected") {
              this.annexureTwoForm.controls['NameOfInspectingOfficer'].setValue(decryptData.NAME_OF_INSPECTING_OFFICER)
              this.annexureTwoForm.controls['NameOfBranch'].setValue(decryptData.NAME_OF_BRANCH)
              // this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(decryptData.DATE_OF_PREV_SURPRISE_VERIFICATION)
              this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(this.getLatestSurpriseDate(decryptData.SV_BRANCH_CODE))
              this.annexureTwoForm.controls['OpeningClosingOfBusiness'].setValue(decryptData.OPENING_CLOSING_OF_BUSINESS);
              // (decryptData.OPENING_CLOSING_OF_BUSINESS || decryptData.OPENING_CLOSING_OF_BUSINESS == null || decryptData.OPENING_CLOSING_OF_BUSINESS == "") ? this.getCurrentDate() : decryptData.OPENING_CLOSING_OF_BUSINESS)
              this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue(decryptData.OPENING_CLOSING_OF_BUSINESS_AMOUNT)
              this.annexureTwoForm.controls['SafeCustodyReceipt'].setValue(decryptData.SAFE_CUSTODY_RECEIPT)
              this.annexureTwoForm.controls['SafeCustodyReceiptDated'].setValue(decryptData.SAFE_CUSTODY_RECEIPT_DATED)
              this.annexureTwoForm.controls['StampedAgreementForms'].setValue(decryptData.STAMPED_AGREEMENT_FORMS)
              this.annexureTwoForm.controls['StampedAgreementFormsAmount'].setValue(decryptData.STAMPED_AGREEMENT_FORMS_AMOUNT)
              this.annexureTwoForm.controls['NoOfPostParcelsHeldByBranch'].setValue(decryptData.NO_OF_POST_PARCELS_HELD_BY_BRANCH)
              this.annexureTwoForm.controls['PostParcelsHeldByBranch'].setValue(decryptData.POST_PARCELS_HELD_BY_BRANCH)
              this.annexureTwoForm.controls['PostalStamps'].setValue(decryptData.POSTAL_STAMPS)
              this.annexureTwoForm.controls['PostalStampsAmount'].setValue(decryptData.POSTAL_STAMPS_AMOUNT)
              this.annexureTwoForm.controls['MonthlyCashVerification'].setValue(decryptData.MONTHLY_CASH_VERIFICATION_OF_CASH)
              this.annexureTwoForm.controls['PeriodicalSurpriseCheck'].setValue(decryptData.PERIODICAL_SURPRISE_CHECK)
              this.annexureTwoForm.controls['KeptUnderJointCustody'].setValue(decryptData.KEPT_UNDER_JOINT_CUSTODY)
              this.annexureTwoForm.controls['JointCustodianVerifying'].setValue(decryptData.JOINT_CUSTODIAN_VERIFYING)
              this.annexureTwoForm.controls['OtherGuidelinesCompiled'].setValue(decryptData.OTHER_GUIDELINES_COMPILED)
              this.annexureTwoForm.controls['Discrepancies'].setValue(decryptData.DISCREPANCIES)
              this.showDescDiv = true;
              this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustody'].setValue(decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY)
              this.ShowingNoV1 = decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY == '0' ? true : false;
              this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintained'].setValue(decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED)
              this.ShowingNoV2 = decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED == '0' ? true : false;
              this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeys'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS)
              this.ShowingNoV3 = decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS == '0' ? true : false;
              this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysDate'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE)
              this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockers'].setValue(decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS)
              this.ShowingNoV4 = decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS == '0' ? true : false;
              this.annexureTwoForm.controls['SafetySecurityFoundThatStoringRoomDoorOfBranch'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH)
              this.annexureTwoForm.controls['SafetySecurityFoundThatDoorOfNetworkRoom'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM)
              this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystem'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM)
              this.ShowingNoVI = decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherUltravioletLampProvided'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED)
              this.ShowingNoVII1 = decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherUltravioletLampWorking'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING)
              this.ShowingNoVII2 = decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING == '0' ? true : false;
              this.annexureTwoForm.controls['CCTVSystemIsProvided'].setValue(decryptData.CCTV_SYSTEM_IS_PROVIDED)
              this.ShowingNoVIII1 = decryptData.CCTV_SYSTEM_IS_PROVIDED == '0' ? true : false;
              this.annexureTwoForm.controls['CCTVSystemIsWorking'].setValue(decryptData.CCTV_SYSTEM_IS_WORKING)
              this.ShowingNoVIII2 = decryptData.CCTV_SYSTEM_IS_WORKING == '0' ? true : false;
              this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailable'].setValue(decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE)
              this.ShowingNoVIII3 = decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE == '0' ? true : false;
              this.annexureTwoForm.controls['CashCountingMachineProvided'].setValue(decryptData.CASH_COUNTING_MACHINE_PROVIDED)
              this.ShowingNoIX1 = decryptData.CASH_COUNTING_MACHINE_PROVIDED == '0' ? true : false;
              this.annexureTwoForm.controls['CashCountingMachineWorking'].setValue(decryptData.CASH_COUNTING_MACHINE_WORKING)
              this.ShowingNoIX2 = decryptData.CASH_COUNTING_MACHINE_WORKING == '0' ? true : false;
              this.annexureTwoForm.controls['NoteSortingMachineProvided'].setValue(decryptData.NOTE_SORTING_MACHINE_PROVIDED)
              this.annexureTwoForm.controls['NoteSortingMachineWorking'].setValue(decryptData.NOTE_SORTING_MACHINE_WORKING)
              this.annexureTwoForm.controls['SecurityGuardIsInvolved'].setValue(decryptData.SECURITY_GUARD_IS_INVOLVED)
              this.ShowingNoXI = decryptData.SECURITY_GUARD_IS_INVOLVED == '1' ? true : false;
              this.annexureTwoForm.controls['SecurityGuardIsInvolvedDetails'].setValue(decryptData.SECURITY_GUARD_IS_INVOLVED_DETAILS)
              this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCash'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH)
              this.ShowingNoXII1 = decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH == '0' ? true : false;
              this.ShowingNoXII1Date = decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH == '1' ? true : false;
              this.annexureTwoForm.controls['PhysicalCashInAtmVerified'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED)
              this.ShowingNoXII2 = decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED == '0' ? true : false;
              this.ShowingNoXII2Date = decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED == '1' ? true : false;

              this.ShowingNo121 = decryptData.WHETHERMACHINESORTEDNOTES == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherMachineSortedNotesNo'].setValue(decryptData.WHETHERMACHINESORTEDNOTESNO)

              this.ShowingNo161 = decryptData.WHETHERAVAITABITITYOFNAM == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherAvaitabitityofNAMNo'].setValue(decryptData.WHETHERAVAITABITITYOFNAMNO)

              this.ShowingNo171 = decryptData.WHETHERFIR == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherFIRNo'].setValue(decryptData.WHETHERFIRNO)

              this.ShowingNo181 = decryptData.MONTHTYCONSOTIDATEDREPORT == '0' ? true : false;
              this.annexureTwoForm.controls['MonthlyConsotidatedReportNo'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORTNO)


              this.annexureTwoForm.controls['Discrepancies'].setValue(decryptData.DISCREPANCIES);
              if (this.annexureTwoForm.get('Discrepancies')?.value == null) {
                this.showDescDiv = false;
                this.annexureTwoForm.controls['SelectDesc'].setValue("No")
              }
              else {
                this.showDescDiv = true;
                this.annexureTwoForm.controls['SelectDesc'].setValue("Yes")
              }


              this.annexureTwoForm.controls['Notes2000'].setValue(decryptData.NOTES_2000)
              this.annexureTwoForm.controls['Notes500'].setValue(decryptData.NOTES_500)
              this.annexureTwoForm.controls['Notes200'].setValue(decryptData.NOTES_200)
              this.annexureTwoForm.controls['Notes100'].setValue(decryptData.NOTES_100)
              this.annexureTwoForm.controls['Notes50'].setValue(decryptData.NOTES_50)
              this.annexureTwoForm.controls['Notes20'].setValue(decryptData.NOTES_20)
              this.annexureTwoForm.controls['Notes10'].setValue(decryptData.NOTES_10)
              this.annexureTwoForm.controls['Notes5'].setValue(decryptData.NOTES_5)
              this.annexureTwoForm.controls['Notes2'].setValue(decryptData.NOTES_2)
              this.annexureTwoForm.controls['Notes1'].setValue(decryptData.NOTES_1)
              this.annexureTwoForm.controls['Coins20'].setValue(decryptData.COINS_20)
              this.annexureTwoForm.controls['Coins10'].setValue(decryptData.COINS_10)
              this.annexureTwoForm.controls['Coins5'].setValue(decryptData.COINS_5)
              this.annexureTwoForm.controls['Coins2'].setValue(decryptData.COINS_2)
              this.annexureTwoForm.controls['Coins1'].setValue(decryptData.COINS_1)
              this.annexureTwoForm.controls['Coins50Paisa'].setValue(decryptData.COINS_50_PAISA)
              this.annexureTwoForm.controls['SafeCustodyReceiptName'].setValue(decryptData.SAFE_CUSTODY_RECEIPTNAME)
              this.annexureTwoForm.controls['SoiledNotesAmt'].setValue(decryptData.SOILED_NOTES_AMT)

              this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustodyNo'].setValue(decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO)
              this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintainedNo'].setValue(decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO)
              this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysNo'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO)
              this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockersNo'].setValue(decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO)
              this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystemNo'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO)
              this.annexureTwoForm.controls['WhetherUltravioletLampProvidedNo'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO)
              this.annexureTwoForm.controls['WhetherUltravioletLampWorkingNo'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO)
              this.annexureTwoForm.controls['CCTVSystemIsProvidedNo'].setValue(decryptData.CCTV_SYSTEM_IS_PROVIDED_NO)
              this.annexureTwoForm.controls['CCTVSystemIsWorkingNo'].setValue(decryptData.CCTV_SYSTEM_IS_WORKING_NO)
              this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailableNo'].setValue(decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO)
              this.annexureTwoForm.controls['CashCountingMachineProvidedNo'].setValue(decryptData.CASH_COUNTING_MACHINE_PROVIDED_NO)
              this.annexureTwoForm.controls['CashCountingMachineWorkingNo'].setValue(decryptData.CASH_COUNTING_MACHINE_WORKING_NO)
              this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCashDate'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_DATE)
              this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCashNo'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO)
              this.annexureTwoForm.controls['PhysicalCashInAtmVerifiedDate'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED_DATE)
              this.annexureTwoForm.controls['PhysicalCashInAtmVerifiedNo'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED_NO)
              this.annexureTwoForm.controls['ActionTakenBranchHead'].setValue(decryptData.ACTION_TAKEN_BY_BRANCH)

              this.annexureTwoForm.controls['WhetherMachineSortedNotes'].setValue(decryptData.WHETHERMACHINESORTEDNOTES)
              this.annexureTwoForm.controls['WhetherMachineSortedNotesNo'].setValue(decryptData.WHETHERMACHINESORTEDNOTESNO)
              this.annexureTwoForm.controls['WhetherAvaitabitityofNAM'].setValue(decryptData.WHETHERAVAITABITITYOFNAM)
              this.annexureTwoForm.controls['WhetherAvaitabitityofNAMNo'].setValue(decryptData.WHETHERAVAITABITITYOFNAMNO)
              this.annexureTwoForm.controls['WhetherFIR'].setValue(decryptData.WHETHERFIR)
              this.annexureTwoForm.controls['WhetherFIRNo'].setValue(decryptData.WHETHERFIRNO)
              this.annexureTwoForm.controls['MonthlyConsotidatedReport'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORT)
              this.annexureTwoForm.controls['MonthlyConsotidatedReportNo'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORTNO)
              this.annexureTwoForm.controls['cashSelectionType'].setValue(decryptData.CASH_SELECTION_TYPE);

              this.Total2000Amount = decryptData.NOTES_2000 * 2000;
              this.Total500Amount = decryptData.NOTES_500 * 500;
              this.Total200Amount = decryptData.NOTES_200 * 200;
              this.Total100Amount = decryptData.NOTES_100 * 100;
              this.Total50Amount = decryptData.NOTES_50 * 50;
              this.Total20Amount = decryptData.NOTES_20 * 20;
              this.Total10Amount = decryptData.NOTES_10 * 10;
              this.Total5Amount = decryptData.NOTES_5 * 5;
              this.Total2Amount = decryptData.NOTES_2 * 2;
              this.Total1Amount = decryptData.NOTES_1 * 1;
              this.Total20AmountCoins = decryptData.COINS_20 * 20;
              this.Total10AmountCoins = decryptData.COINS_10 * 10;
              this.Total5AmountCoins = decryptData.COINS_5 * 5;
              this.Total2AmountCoins = decryptData.COINS_2 * 2;
              this.Total1AmountCoins = decryptData.COINS_1 * 1;
              this.Total50PaisaAmountCoins = decryptData.COINS_50_PAISA * 0.50;

              this.calculateTotalSum();
              this.annexureTwoForm.get('SelectDesc')?.disable();
              this.showForm = true;
              this.showbutton = true;
              this.ShowBranchAction = true;

              if (decryptData.IS_DISABLE == "Y" && decryptData.ANNEXURE_STATUS == "Approved" && decryptData.ANNEXURE_STATUS_BRANCH == null && decryptData.MODIFIED_BY == current) {
                this.annexureTwoForm.disable();
                this.annexureTwoForm.get('FinancialYearTwo')?.enable();
                this.annexureTwoForm.get('QuaterTwo')?.enable();
                this.showRejectbutton = false;
                this.showApprovedbutton = false;
                this.showbutton = false;
                this.annexureTwoForm.get('ActionTakenBranchHead')?.enable();
                this.ShowBranchAction = true;

              }
              else if (decryptData.ANNEXURE_STATUS == "Approved" && decryptData.CREATED_BY == current) {
                this.ShowBranchAction = false;
                this.showbutton = false;
                this.annexureTwoForm.disable();
                this.annexureTwoForm.get('FinancialYearTwo')?.enable();
                this.annexureTwoForm.get('QuaterTwo')?.enable();
              }
              else if (decryptData.ANNEXURE_STATUS_BRANCH == "Scrutinized") {
                this.ShowBranchAction = true;
                this.showbutton = false;
                this.annexureTwoForm.disable();
                this.BranchCompliedButton = false;
                this.BranchNotCompliedButton = false;
                this.annexureTwoForm.get('FinancialYearTwo')?.enable();
                this.annexureTwoForm.get('QuaterTwo')?.enable();
              }
              else if (decryptData.ANNEXURE_STATUS == null && decryptData.DISCREPANCIES == null) {
                this.showbutton = true;
                this.annexureTwoForm.enable();
              }
              else if (decryptData.ANNEXURE_STATUS == "Submitted-Disable" && decryptData.DISCREPANCIES == null) {
                this.showForm = false;
              }
              else if (decryptData.ANNEXURE_STATUS == "Submitted-Disable") {
                this.showbutton = false;
                this.annexureTwoForm.disable();
                this.annexureTwoForm.get('FinancialYearTwo')?.enable();
                this.annexureTwoForm.get('QuaterTwo')?.enable();
                this.ShowBranchAction = false;
              }
              else if (item.AnnexureTwoData.ANNEXURE_STATUS == "Approved") {
                this.showbutton = false;
                this.annexureTwoForm.disable();
                this.annexureTwoForm.get('ActionTakenBranchHead')?.enable();
                this.annexureTwoForm.get('FinancialYearTwo')?.enable();
                this.annexureTwoForm.get('QuaterTwo')?.enable();
                this.BranchCompliedButton = true;
                this.BranchNotCompliedButton = true;
              }
              else if (decryptData.ANNEXURE_STATUS == "Saved") {
                this.showbutton = true;
                this.annexureTwoForm.enable();
              }
              else {
                this.showRejectbutton = false;
                this.showApprovedbutton = false;
                this.showbutton = false;
                this.ShowBranchAction = true;
                this.annexureTwoForm.disable();
                this.annexureTwoForm.get('FinancialYearTwo')?.enable();
                this.annexureTwoForm.get('QuaterTwo')?.enable();
                this.BranchCompliedButton = true;
                this.BranchNotCompliedButton = true;
                this.annexureTwoForm.get('ActionTakenBranchHead')?.enable();
              }
            }
            else if (item.AnnexureOneData.BRANCH_PFNO == current && item.AnnexureTwoData.IS_DISABLE == "N" && decryptData.ANNEXURE_STATUS == "Saved") {
              this.annexureTwoForm.controls['NameOfInspectingOfficer'].setValue(decryptData.NAME_OF_INSPECTING_OFFICER)
              this.annexureTwoForm.controls['NameOfBranch'].setValue(decryptData.NAME_OF_BRANCH)
              // this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(decryptData.DATE_OF_PREV_SURPRISE_VERIFICATION)
              this.annexureTwoForm.controls['DateOfPrevSurpriseVerification'].setValue(this.getLatestSurpriseDate(decryptData.SV_BRANCH_CODE))
              this.annexureTwoForm.controls['OpeningClosingOfBusiness'].setValue(decryptData.OPENING_CLOSING_OF_BUSINESS)
              //(decryptData.OPENING_CLOSING_OF_BUSINESS || decryptData.OPENING_CLOSING_OF_BUSINESS == null || decryptData.OPENING_CLOSING_OF_BUSINESS == "") ? this.getCurrentDate() : decryptData.OPENING_CLOSING_OF_BUSINESS
              this.annexureTwoForm.controls['OpeningClosingOfBusinessAmount'].setValue(decryptData.OPENING_CLOSING_OF_BUSINESS_AMOUNT)
              this.annexureTwoForm.controls['SafeCustodyReceipt'].setValue(decryptData.SAFE_CUSTODY_RECEIPT)
              this.annexureTwoForm.controls['SafeCustodyReceiptDated'].setValue(decryptData.SAFE_CUSTODY_RECEIPT_DATED)
              this.annexureTwoForm.controls['StampedAgreementForms'].setValue(decryptData.STAMPED_AGREEMENT_FORMS)
              this.annexureTwoForm.controls['StampedAgreementFormsAmount'].setValue(decryptData.STAMPED_AGREEMENT_FORMS_AMOUNT)
              this.annexureTwoForm.controls['NoOfPostParcelsHeldByBranch'].setValue(decryptData.NO_OF_POST_PARCELS_HELD_BY_BRANCH)
              this.annexureTwoForm.controls['PostParcelsHeldByBranch'].setValue(decryptData.POST_PARCELS_HELD_BY_BRANCH)
              this.annexureTwoForm.controls['PostalStamps'].setValue(decryptData.POSTAL_STAMPS)
              this.annexureTwoForm.controls['PostalStampsAmount'].setValue(decryptData.POSTAL_STAMPS_AMOUNT)
              this.annexureTwoForm.controls['MonthlyCashVerification'].setValue(decryptData.MONTHLY_CASH_VERIFICATION_OF_CASH)
              this.annexureTwoForm.controls['PeriodicalSurpriseCheck'].setValue(decryptData.PERIODICAL_SURPRISE_CHECK)
              this.annexureTwoForm.controls['KeptUnderJointCustody'].setValue(decryptData.KEPT_UNDER_JOINT_CUSTODY)
              this.annexureTwoForm.controls['JointCustodianVerifying'].setValue(decryptData.JOINT_CUSTODIAN_VERIFYING)
              this.annexureTwoForm.controls['OtherGuidelinesCompiled'].setValue(decryptData.OTHER_GUIDELINES_COMPILED)
              this.annexureTwoForm.controls['Discrepancies'].setValue(decryptData.DISCREPANCIES)
              this.showDescDiv = true;
              this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustody'].setValue(decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY)
              this.ShowingNoV1 = decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY == '0' ? true : false;
              this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintained'].setValue(decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED)
              this.ShowingNoV2 = decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED == '0' ? true : false;
              this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeys'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS)
              this.ShowingNoV3 = decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS == '0' ? true : false;
              this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysDate'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_DATE)
              this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockers'].setValue(decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS)
              this.ShowingNoV4 = decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS == '0' ? true : false;
              this.annexureTwoForm.controls['SafetySecurityFoundThatStoringRoomDoorOfBranch'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_STRONG_ROOM_DOOR_OF_BRANCH)
              this.annexureTwoForm.controls['SafetySecurityFoundThatDoorOfNetworkRoom'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_DOOR_OF_NETWORK_ROOM)
              this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystem'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM)
              this.ShowingNoVI = decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherUltravioletLampProvided'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED)
              this.ShowingNoVII1 = decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherUltravioletLampWorking'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING)
              this.ShowingNoVII2 = decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING == '0' ? true : false;
              this.annexureTwoForm.controls['CCTVSystemIsProvided'].setValue(decryptData.CCTV_SYSTEM_IS_PROVIDED)
              this.ShowingNoVIII1 = decryptData.CCTV_SYSTEM_IS_PROVIDED == '0' ? true : false;
              this.annexureTwoForm.controls['CCTVSystemIsWorking'].setValue(decryptData.CCTV_SYSTEM_IS_WORKING)
              this.ShowingNoVIII2 = decryptData.CCTV_SYSTEM_IS_WORKING == '0' ? true : false;
              this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailable'].setValue(decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE)
              this.ShowingNoVIII3 = decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE == '0' ? true : false;
              this.annexureTwoForm.controls['CashCountingMachineProvided'].setValue(decryptData.CASH_COUNTING_MACHINE_PROVIDED)
              this.ShowingNoIX1 = decryptData.CASH_COUNTING_MACHINE_PROVIDED == '0' ? true : false;
              this.annexureTwoForm.controls['CashCountingMachineWorking'].setValue(decryptData.CASH_COUNTING_MACHINE_WORKING)
              this.ShowingNoIX2 = decryptData.CASH_COUNTING_MACHINE_WORKING == '0' ? true : false;
              this.annexureTwoForm.controls['NoteSortingMachineProvided'].setValue(decryptData.NOTE_SORTING_MACHINE_PROVIDED)
              this.annexureTwoForm.controls['NoteSortingMachineWorking'].setValue(decryptData.NOTE_SORTING_MACHINE_WORKING)
              this.annexureTwoForm.controls['SecurityGuardIsInvolved'].setValue(decryptData.SECURITY_GUARD_IS_INVOLVED)
              this.ShowingNoXI = decryptData.SECURITY_GUARD_IS_INVOLVED == '1' ? true : false;
              this.annexureTwoForm.controls['SecurityGuardIsInvolvedDetails'].setValue(decryptData.SECURITY_GUARD_IS_INVOLVED_DETAILS)
              this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCash'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH)
              this.ShowingNoXII1 = decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH == '0' ? true : false;
              this.ShowingNoXII1Date = decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH == '1' ? true : false;
              this.annexureTwoForm.controls['PhysicalCashInAtmVerified'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED)
              this.ShowingNoXII2 = decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED == '0' ? true : false;
              this.ShowingNoXII2Date = decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED == '1' ? true : false;

              this.ShowingNo121 = decryptData.WHETHERMACHINESORTEDNOTES == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherMachineSortedNotesNo'].setValue(decryptData.WHETHERMACHINESORTEDNOTESNO)

              this.ShowingNo161 = decryptData.WHETHERAVAITABITITYOFNAM == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherAvaitabitityofNAMNo'].setValue(decryptData.WHETHERAVAITABITITYOFNAMNO)

              this.ShowingNo171 = decryptData.WHETHERFIR == '0' ? true : false;
              this.annexureTwoForm.controls['WhetherFIRNo'].setValue(decryptData.WHETHERFIRNO)

              this.ShowingNo181 = decryptData.MONTHTYCONSOTIDATEDREPORT == '0' ? true : false;
              this.annexureTwoForm.controls['MonthlyConsotidatedReportNo'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORTNO)


              this.annexureTwoForm.controls['Discrepancies'].setValue(decryptData.DISCREPANCIES);
              if (this.annexureTwoForm.get('Discrepancies')?.value == null) {
                this.showDescDiv = false;
              }
              else {
                this.showDescDiv = true;
              }
              this.annexureTwoForm.controls['Notes2000'].setValue(decryptData.NOTES_2000)
              this.annexureTwoForm.controls['Notes500'].setValue(decryptData.NOTES_500)
              this.annexureTwoForm.controls['Notes200'].setValue(decryptData.NOTES_200)
              this.annexureTwoForm.controls['Notes100'].setValue(decryptData.NOTES_100)
              this.annexureTwoForm.controls['Notes50'].setValue(decryptData.NOTES_50)
              this.annexureTwoForm.controls['Notes20'].setValue(decryptData.NOTES_20)
              this.annexureTwoForm.controls['Notes10'].setValue(decryptData.NOTES_10)
              this.annexureTwoForm.controls['Notes5'].setValue(decryptData.NOTES_5)
              this.annexureTwoForm.controls['Notes2'].setValue(decryptData.NOTES_2)
              this.annexureTwoForm.controls['Notes1'].setValue(decryptData.NOTES_1)
              this.annexureTwoForm.controls['Coins20'].setValue(decryptData.COINS_20)
              this.annexureTwoForm.controls['Coins10'].setValue(decryptData.COINS_10)
              this.annexureTwoForm.controls['Coins5'].setValue(decryptData.COINS_5)
              this.annexureTwoForm.controls['Coins2'].setValue(decryptData.COINS_2)
              this.annexureTwoForm.controls['Coins1'].setValue(decryptData.COINS_1)
              this.annexureTwoForm.controls['Coins50Paisa'].setValue(decryptData.COINS_50_PAISA)
              this.annexureTwoForm.controls['SafeCustodyReceiptName'].setValue(decryptData.SAFE_CUSTODY_RECEIPTNAME)
              this.annexureTwoForm.controls['SoiledNotesAmt'].setValue(decryptData.SOILED_NOTES_AMT)

              this.annexureTwoForm.controls['KeyRegisterKeptUnderJointCustodyNo'].setValue(decryptData.KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO)
              this.annexureTwoForm.controls['KeyRegisterWhetherKeyRegisterMaintainedNo'].setValue(decryptData.KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO)
              this.annexureTwoForm.controls['KeyRegisterDuplicateSetOfCashKeysNo'].setValue(decryptData.KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO)
              this.annexureTwoForm.controls['KeyRegisterMasterKeyOfTheLockersNo'].setValue(decryptData.KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO)
              this.annexureTwoForm.controls['SafetySecurityFoundThatBurglaryAlarmSystemNo'].setValue(decryptData.SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO)
              this.annexureTwoForm.controls['WhetherUltravioletLampProvidedNo'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO)
              this.annexureTwoForm.controls['WhetherUltravioletLampWorkingNo'].setValue(decryptData.WHETHER_ULTRAVIOLET_LAMP_WORKING_NO)
              this.annexureTwoForm.controls['CCTVSystemIsProvidedNo'].setValue(decryptData.CCTV_SYSTEM_IS_PROVIDED_NO)
              this.annexureTwoForm.controls['CCTVSystemIsWorkingNo'].setValue(decryptData.CCTV_SYSTEM_IS_WORKING_NO)
              this.annexureTwoForm.controls['CCTVRecordingOfLast90DaysAvailableNo'].setValue(decryptData.CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO)
              this.annexureTwoForm.controls['CashCountingMachineProvidedNo'].setValue(decryptData.CASH_COUNTING_MACHINE_PROVIDED_NO)
              this.annexureTwoForm.controls['CashCountingMachineWorkingNo'].setValue(decryptData.CASH_COUNTING_MACHINE_WORKING_NO)
              this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCashDate'].setValue(this.getCurrentDate()) //decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_DATE
              this.annexureTwoForm.controls['WhetherBranchHasConductedSurpriseCashNo'].setValue(decryptData.WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO)
              this.annexureTwoForm.controls['PhysicalCashInAtmVerifiedDate'].setValue(this.getCurrentDate()) //decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED_DATE
              this.annexureTwoForm.controls['PhysicalCashInAtmVerifiedNo'].setValue(decryptData.PHYSICAL_CASH_IN_ATM_VERIFIED_NO)
              this.annexureTwoForm.controls['ActionTakenBranchHead'].setValue(decryptData.ACTION_TAKEN_BY_BRANCH)

              this.annexureTwoForm.controls['WhetherMachineSortedNotes'].setValue(decryptData.WHETHERMACHINESORTEDNOTES)
              this.annexureTwoForm.controls['WhetherMachineSortedNotesNo'].setValue(decryptData.WHETHERMACHINESORTEDNOTESNO)
              this.annexureTwoForm.controls['WhetherAvaitabitityofNAM'].setValue(decryptData.WHETHERAVAITABITITYOFNAM)
              this.annexureTwoForm.controls['WhetherAvaitabitityofNAMNo'].setValue(decryptData.WHETHERAVAITABITITYOFNAMNO)
              this.annexureTwoForm.controls['WhetherFIR'].setValue(decryptData.WHETHERFIR)
              this.annexureTwoForm.controls['WhetherFIRNo'].setValue(decryptData.WHETHERFIRNO)
              this.annexureTwoForm.controls['MonthlyConsotidatedReport'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORT)
              this.annexureTwoForm.controls['MonthlyConsotidatedReportNo'].setValue(decryptData.MONTHTYCONSOTIDATEDREPORTNO)
              this.annexureTwoForm.controls['cashSelectionType'].setValue(decryptData.CASH_SELECTION_TYPE);


              this.Total2000Amount = decryptData.NOTES_2000 * 2000;
              this.Total500Amount = decryptData.NOTES_500 * 500;
              this.Total200Amount = decryptData.NOTES_200 * 200;
              this.Total100Amount = decryptData.NOTES_100 * 100;
              this.Total50Amount = decryptData.NOTES_50 * 50;
              this.Total20Amount = decryptData.NOTES_20 * 20;
              this.Total10Amount = decryptData.NOTES_10 * 10;
              this.Total5Amount = decryptData.NOTES_5 * 5;
              this.Total2Amount = decryptData.NOTES_2 * 2;
              this.Total1Amount = decryptData.NOTES_1 * 1;
              this.Total20AmountCoins = decryptData.COINS_20 * 20;
              this.Total10AmountCoins = decryptData.COINS_10 * 10;
              this.Total5AmountCoins = decryptData.COINS_5 * 5;
              this.Total2AmountCoins = decryptData.COINS_2 * 2;
              this.Total1AmountCoins = decryptData.COINS_1 * 1;
              this.Total50PaisaAmountCoins = decryptData.COINS_50_PAISA * 0.50;

              this.calculateTotalSum();
              this.showForm = true;
              this.annexureTwoForm.enable();
              this.ShowBranchAction = false;
              this.showbutton = true;
            }
            else if (item.AnnexureOneData.BRANCH_PFNO == current) {
              this.annexureTwoForm.get('NameOfInspectingOfficer')?.enable();
              this.annexureTwoForm.get('NameOfBranch')?.enable();
              this.annexureTwoForm.get('DateOfPrevSurpriseVerification')?.enable();
              this.annexureTwoForm.get('OpeningClosingOfBusiness')?.enable();
              this.annexureTwoForm.get('OpeningClosingOfBusinessAmount')?.enable();
              this.annexureTwoForm.get('SafeCustodyReceipt')?.enable();
              this.annexureTwoForm.get('SafeCustodyReceiptDated')?.enable();
              this.annexureTwoForm.get('StampedAgreementForms')?.enable();
              this.annexureTwoForm.get('StampedAgreementFormsAmount')?.enable();
              this.annexureTwoForm.get('NoOfPostParcelsHeldByBranch')?.enable();
              this.annexureTwoForm.get('PostParcelsHeldByBranch')?.enable();
              this.annexureTwoForm.get('PostalStamps')?.enable();
              this.annexureTwoForm.get('PostalStampsAmount')?.enable();
              this.annexureTwoForm.get('MonthlyCashVerification')?.enable();
              this.annexureTwoForm.get('PeriodicalSurpriseCheck')?.enable();
              this.annexureTwoForm.get('KeptUnderJointCustody')?.enable();
              this.annexureTwoForm.get('JointCustodianVerifying')?.enable();
              this.annexureTwoForm.get('OtherGuidelinesCompiled')?.enable();
              this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustody')?.enable();
              this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintained')?.enable();
              this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeys')?.enable();
              this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysDate')?.enable();
              this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockers')?.enable();
              this.annexureTwoForm.get('SafetySecurityFoundThatStoringRoomDoorOfBranch')?.enable();
              this.annexureTwoForm.get('SafetySecurityFoundThatDoorOfNetworkRoom')?.enable();
              this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystem')?.enable();
              this.annexureTwoForm.get('WhetherUltravioletLampProvided')?.enable();
              this.annexureTwoForm.get('WhetherUltravioletLampWorking')?.enable();
              this.annexureTwoForm.get('CCTVSystemIsProvided')?.enable();
              this.annexureTwoForm.get('CCTVSystemIsWorking')?.enable();
              this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailable')?.enable();
              this.annexureTwoForm.get('CashCountingMachineProvided')?.enable();
              this.annexureTwoForm.get('CashCountingMachineWorking')?.enable();
              this.annexureTwoForm.get('NoteSortingMachineProvided')?.enable();
              this.annexureTwoForm.get('NoteSortingMachineWorking')?.enable();
              this.annexureTwoForm.get('SecurityGuardIsInvolved')?.enable();
              this.annexureTwoForm.get('SecurityGuardIsInvolvedDetails')?.enable();
              this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCash')?.enable();
              this.annexureTwoForm.get('PhysicalCashInAtmVerified')?.enable();
              this.annexureTwoForm.get('SelectDesc')?.enable();
              //this.annexureTwoForm.get('Discrepancies')?.enable();
              // // this.annexureTwoForm.get('Notes2000')?.enable();
              // this.annexureTwoForm.get('Notes500')?.enable();
              // this.annexureTwoForm.get('Notes200')?.enable();
              // this.annexureTwoForm.get('Notes100')?.enable();
              // this.annexureTwoForm.get('Notes50')?.enable();
              // this.annexureTwoForm.get('Notes20')?.enable();
              // this.annexureTwoForm.get('Notes10')?.enable();
              // this.annexureTwoForm.get('Notes5')?.enable();
              // this.annexureTwoForm.get('Notes2')?.enable();
              // this.annexureTwoForm.get('Notes1')?.enable();
              // this.annexureTwoForm.get('Coins20')?.enable();
              // this.annexureTwoForm.get('Coins10')?.enable();
              // this.annexureTwoForm.get('Coins5')?.enable();
              // this.annexureTwoForm.get('Coins2')?.enable();
              // this.annexureTwoForm.get('Coins1')?.enable();
              // this.annexureTwoForm.get('Coins50Paisa')?.enable();
              this.annexureTwoForm.get('SafeCustodyReceiptName')?.enable();
              this.annexureTwoForm.get('SoiledNotesAmt')?.enable();
              this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustodyNo')?.enable();
              this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')?.enable();
              this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')?.enable();
              this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockersNo')?.enable();
              this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystemNo')?.enable();
              this.annexureTwoForm.get('WhetherUltravioletLampProvidedNo')?.enable();
              this.annexureTwoForm.get('WhetherUltravioletLampWorkingNo')?.enable();
              this.annexureTwoForm.get('CCTVSystemIsProvidedNo')?.enable();
              this.annexureTwoForm.get('CCTVSystemIsWorkingNo')?.enable();
              this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailableNo')?.enable();
              this.annexureTwoForm.get('CashCountingMachineProvidedNo')?.enable();
              this.annexureTwoForm.get('CashCountingMachineWorkingNo')?.enable();
              this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashDate')?.enable();
              this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashNo')?.enable();
              this.annexureTwoForm.get('PhysicalCashInAtmVerifiedDate')?.enable();
              this.annexureTwoForm.get('PhysicalCashInAtmVerifiedNo')?.enable();

              this.annexureTwoForm.get('WhetherMachineSortedNotes')?.enable();
              this.annexureTwoForm.get('WhetherMachineSortedNotesNo')?.enable();
              this.annexureTwoForm.get('WhetherAvaitabitityofNAM')?.enable();
              this.annexureTwoForm.get('WhetherAvaitabitityofNAMNo')?.enable();
              this.annexureTwoForm.get('WhetherFIR')?.enable();
              this.annexureTwoForm.get('WhetherFIRNo')?.enable();
              this.annexureTwoForm.get('MonthlyConsotidatedReport')?.enable();
              this.annexureTwoForm.get('MonthlyConsotidatedReportNo')?.enable();

              //this.annexureTwoForm.reset();
              this.annexureTwoForm.enable;
              this.showForm = true;
              this.annexureTwoForm = this.fb.group({
                LoggedUserId: [''],
                NameOfInspectingOfficer: ['', Validators.required],
                NameOfBranch: ['', Validators.required],
                // DateOfPrevSurpriseVerification: [this.getCurrentDate()],
                DateOfPrevSurpriseVerification: [this.getLatestSurpriseDate(decryptData.SV_BRANCH_CODE)],
                DateOfVerification: [this.getCurrentDate()],
                OpeningClosingOfBusiness: [],
                OpeningClosingOfBusinessAmount: [''],
                SoiledNotesAmt: ['', Validators.required],
                SafeCustodyReceiptDated: [this.getCurrentDate()],
                SafeCustodyReceiptName: ['', Validators.required],
                SafeCustodyReceipt: ['', Validators.required],
                StampedAgreementForms: ['', Validators.required],
                StampedAgreementFormsAmount: ['', Validators.required],
                NoOfPostParcelsHeldByBranch: ['', Validators.required],
                PostParcelsHeldByBranch: ['', Validators.required],
                PostalStamps: ['', Validators.required],
                PostalStampsAmount: ['', Validators.required],
                MonthlyCashVerification: ['', Validators.required],
                PeriodicalSurpriseCheck: ['', Validators.required],
                KeptUnderJointCustody: ['', Validators.required],
                JointCustodianVerifying: ['', Validators.required],
                OtherGuidelinesCompiled: ['', Validators.required],
                KeyRegisterKeptUnderJointCustody: ['', Validators.required],
                KeyRegisterWhetherKeyRegisterMaintained: ['', Validators.required],
                KeyRegisterDuplicateSetOfCashKeys: ['', Validators.required],
                KeyRegisterDuplicateSetOfCashKeysDate: [this.maxDate],
                KeyRegisterMasterKeyOfTheLockers: ['', Validators.required],
                SafetySecurityFoundThatStoringRoomDoorOfBranch: ['', Validators.required],
                SafetySecurityFoundThatDoorOfNetworkRoom: ['', Validators.required],
                SafetySecurityFoundThatBurglaryAlarmSystem: ['', Validators.required],
                WhetherUltravioletLampProvided: ['', Validators.required],
                WhetherUltravioletLampWorking: ['', Validators.required],
                CCTVSystemIsProvided: ['', Validators.required],
                CCTVSystemIsWorking: ['', Validators.required],
                CCTVRecordingOfLast90DaysAvailable: ['', Validators.required],
                CashCountingMachineProvided: ['', Validators.required],
                CashCountingMachineWorking: ['', Validators.required],
                NoteSortingMachineProvided: ['', Validators.required],
                NoteSortingMachineWorking: ['', Validators.required],
                SecurityGuardIsInvolved: ['', Validators.required],
                SecurityGuardIsInvolvedDetails: [''],
                WhetherBranchHasConductedSurpriseCash: ['', Validators.required],
                PhysicalCashInAtmVerified: ['', Validators.required],
                Discrepancies: ['', Validators.required],
                Notes2000: ['', Validators.required],
                Notes500: ['', Validators.required],
                Notes200: ['', Validators.required],
                Notes100: ['', Validators.required],
                Notes50: ['', Validators.required],
                Notes20: ['', Validators.required],
                Notes10: ['', Validators.required],
                Notes5: ['', Validators.required],
                Notes2: ['', Validators.required],
                Notes1: ['', Validators.required],
                Coins20: ['', Validators.required],
                Coins10: ['', Validators.required],
                Coins5: ['', Validators.required],
                Coins2: ['', Validators.required],
                Coins1: ['', Validators.required],
                Coins50Paisa: ['', Validators.required],
                KeyRegisterKeptUnderJointCustodyNo: [''],
                KeyRegisterWhetherKeyRegisterMaintainedNo: [''],
                KeyRegisterDuplicateSetOfCashKeysNo: [''],
                KeyRegisterMasterKeyOfTheLockersNo: [''],
                SafetySecurityFoundThatBurglaryAlarmSystemNo: [''],
                WhetherUltravioletLampProvidedNo: [''],
                WhetherUltravioletLampWorkingNo: [''],
                CCTVSystemIsProvidedNo: [''],
                CCTVSystemIsWorkingNo: [''],
                CCTVRecordingOfLast90DaysAvailableNo: [''],
                CashCountingMachineProvidedNo: [''],
                CashCountingMachineWorkingNo: [''],
                WhetherBranchHasConductedSurpriseCashDate: [this.getCurrentDate()],
                WhetherBranchHasConductedSurpriseCashNo: [''],
                PhysicalCashInAtmVerifiedDate: [this.getCurrentDate()],
                PhysicalCashInAtmVerifiedNo: [''],
                ActionTakenBranchHead: [''],
                ActionTakenROHead: [''],
                ActionTakenZOHead: [''],
                ActionTakenCOHead: [''],
                WhetherMachineSortedNotes: ['', Validators.required],
                WhetherMachineSortedNotesNo: [''],
                WhetherAvaitabitityofNAM: ['', Validators.required],
                WhetherAvaitabitityofNAMNo: [''],
                WhetherFIR: ['', Validators.required],
                WhetherFIRNo: [''],
                MonthlyConsotidatedReport: ['', Validators.required],
                MonthlyConsotidatedReportNo: [''],
                cashSelectionType: ['BOD'], // Default selected
                SelectDesc: ['', Validators.required],
              });

              this.showbutton = true;
              this.ShowBranchAction = false;
              let emp_name = this._persistanceService.getSessionStorage('emp_name');
              let branch_name = this._persistanceService.getSessionStorage('branch_name');

              this.annexureTwoForm.controls['NameOfInspectingOfficer'].setValue(emp_name);
              this.annexureTwoForm.controls['NameOfBranch'].setValue(branch_name);
              this.onSelection('BOD');
            }
            else {
              this.showForm = false;
            }
          }

        }

      },
      (error: any) => {
        console.log('error', error);
      }
    )
  }

  updateValidator() {
    const textInputControl = this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustodyNo')
    const optionValue = this.annexureTwoForm.get('KeyRegisterKeptUnderJointCustody')?.value;
    const textInputControl1 = this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintainedNo')
    const optionValue1 = this.annexureTwoForm.get('KeyRegisterWhetherKeyRegisterMaintained')?.value;
    const textInputControl2 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysNo')
    const optionValue2 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeys')?.value;
    const textInputControl3 = this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockersNo')
    const optionValue3 = this.annexureTwoForm.get('KeyRegisterMasterKeyOfTheLockers')?.value;
    const textInputControl4 = this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystemNo')
    const optionValue4 = this.annexureTwoForm.get('SafetySecurityFoundThatBurglaryAlarmSystem')?.value;
    const textInputControl5 = this.annexureTwoForm.get('WhetherUltravioletLampProvidedNo')
    const optionValue5 = this.annexureTwoForm.get('WhetherUltravioletLampProvided')?.value;
    const textInputControl6 = this.annexureTwoForm.get('WhetherUltravioletLampWorkingNo')
    const optionValue6 = this.annexureTwoForm.get('WhetherUltravioletLampWorking')?.value;
    const textInputControl7 = this.annexureTwoForm.get('CCTVSystemIsProvidedNo')
    const optionValue7 = this.annexureTwoForm.get('CCTVSystemIsProvided')?.value;
    const textInputControl8 = this.annexureTwoForm.get('CCTVSystemIsWorkingNo')
    const optionValue8 = this.annexureTwoForm.get('CCTVSystemIsWorking')?.value;
    const textInputControl9 = this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailableNo')
    const optionValue9 = this.annexureTwoForm.get('CCTVRecordingOfLast90DaysAvailable')?.value;
    const textInputControl10 = this.annexureTwoForm.get('CashCountingMachineProvidedNo')
    const optionValue10 = this.annexureTwoForm.get('CashCountingMachineProvided')?.value;
    const textInputControl11 = this.annexureTwoForm.get('CashCountingMachineWorkingNo')
    const optionValue11 = this.annexureTwoForm.get('CashCountingMachineWorking')?.value;
    const textInputControl12 = this.annexureTwoForm.get('SecurityGuardIsInvolvedDetails')
    const optionValue12 = this.annexureTwoForm.get('SecurityGuardIsInvolved')?.value;
    const textInputControl13 = this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashNo')
    const optionValue13 = this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCash')?.value;
    const textInputControl14 = this.annexureTwoForm.get('PhysicalCashInAtmVerifiedNo')

    const optionValue14 = this.annexureTwoForm.get('PhysicalCashInAtmVerified')?.value;
    const textInputControl15 = this.annexureTwoForm.get('PhysicalCashInAtmVerifiedDate')

    const textInputControl16 = this.annexureTwoForm.get('KeyRegisterDuplicateSetOfCashKeysDate')
    const textInputControl17 = this.annexureTwoForm.get('WhetherBranchHasConductedSurpriseCashDate')


    if (optionValue == '0' || optionValue1 == '0' || optionValue2 == '0' || optionValue3 == '0' || optionValue4 == '1' || optionValue5 == '0' || optionValue6 == '0' || optionValue7 == '0' || optionValue8 == '0'
      || optionValue9 == '0' || optionValue10 == '0' || optionValue11 == '0' || optionValue12 == '1' || optionValue13 == '0' || optionValue14 == '0' || optionValue14 == '1' || optionValue2 == '1' || optionValue13 == '1') {
      textInputControl?.setValidators([Validators.required]);
      textInputControl1?.setValidators([Validators.required]);
      textInputControl2?.setValidators([Validators.required]);
      textInputControl3?.setValidators([Validators.required]);
      textInputControl4?.setValidators([Validators.required]);
      textInputControl5?.setValidators([Validators.required]);
      textInputControl6?.setValidators([Validators.required]);
      textInputControl7?.setValidators([Validators.required]);
      textInputControl8?.setValidators([Validators.required]);
      textInputControl9?.setValidators([Validators.required]);
      textInputControl10?.setValidators([Validators.required]);
      textInputControl11?.setValidators([Validators.required]);
      textInputControl12?.setValidators([Validators.required]);
      textInputControl13?.setValidators([Validators.required]);
      textInputControl14?.setValidators([Validators.required]);
      textInputControl15?.setValidators([Validators.required]);
      textInputControl16?.setValidators([Validators.required]);
      textInputControl17?.setValidators([Validators.required]);



      textInputControl?.updateValueAndValidity();
      textInputControl1?.updateValueAndValidity();
      textInputControl2?.updateValueAndValidity();
      textInputControl3?.updateValueAndValidity();
      textInputControl4?.updateValueAndValidity();
      textInputControl5?.updateValueAndValidity();
      textInputControl6?.updateValueAndValidity();
      textInputControl7?.updateValueAndValidity();
      textInputControl8?.updateValueAndValidity();
      textInputControl9?.updateValueAndValidity();
      textInputControl10?.updateValueAndValidity();
      textInputControl11?.updateValueAndValidity();
      textInputControl12?.updateValueAndValidity();
      textInputControl13?.updateValueAndValidity();
      textInputControl14?.updateValueAndValidity();
      textInputControl15?.updateValueAndValidity();
      textInputControl16?.updateValueAndValidity();
      textInputControl17?.updateValueAndValidity();

    }
    else {
      textInputControl?.clearValidators();
      textInputControl1?.clearValidators();
      textInputControl2?.clearValidators();
      textInputControl3?.clearValidators();
      textInputControl4?.clearValidators();
      textInputControl5?.clearValidators();
      textInputControl6?.clearValidators();
      textInputControl7?.clearValidators();
      textInputControl8?.clearValidators();
      textInputControl9?.clearValidators();
      textInputControl10?.clearValidators();
      textInputControl11?.clearValidators();
      textInputControl12?.clearValidators();
      textInputControl13?.clearValidators();
      textInputControl14?.clearValidators();
      textInputControl15?.clearValidators();
      textInputControl16?.clearValidators();

      textInputControl17?.clearValidators();
    }

  }

  getBranchByZoneRegion(zone: string, region: string) {
    this.surprisecash.getBranchByZoneRegion(zone, region).subscribe((response: any) => {

      if (response.status == 'success') {
        this.allBranches = response.data;
        this._persistanceService.setSessionStorage('branch_name', response.data.brancH_NAME);
        this.matchBranchesWithData();

      }
    })
  }

  matchBranchesWithData() {
    if (!this.allBranches || !this.data) {
      return;
    }

    this.data.forEach(item => {
      let matchingBranch = this.allBranches.find(branch => branch.brancH_CODE === item.AnnexureOneData.SV_BRANCH_CODE);
      if (matchingBranch) {
        item.brancH_NAME = matchingBranch.brancH_NAME;

      }

    })
  }

  matchBranchesWithDataannexureTwo() {
    if (!this.allBranches || !this.annexureTwodata) {
      return;
    }

    this.annexureTwodata.forEach(item => {
      let matchingBranch = this.allBranches.find(branch => branch.brancH_CODE === item.AnnexureOneData.SV_BRANCH_CODE);
      if (matchingBranch) {
        item.brancH_NAME = matchingBranch.brancH_NAME;

      }

    })
  }
  getFilteredBranches(branchGroup: AbstractControl, index: number) {
    const svBranchCode = branchGroup.get('SvBranchCode')?.value;
    const brCode = branchGroup.get('IoBranchCode')?.value;
    let branch = svBranchCode.split('-')[0];
    this.surprisecash.getBranchBybrCode(branch).subscribe((response: any) => {
      if (response.status == 'success') {
        this.Branches = response.rData;
        const officersArray = this.getOfficersFormArray;
        const branchIndex = officersArray.controls.indexOf(branchGroup);
        const control = officersArray.at(branchIndex);
        if (control) {
          control.get('ToBranchOfficierBranchName1')?.setValue(response.rData.brancH_NAME);
          control.get('SvBranchCode')?.setValue(response.rData.brancH_CODE);
          this._persistanceService.setSessionStorage('ToBranchOfficierBranchName1', response.rData.brancH_NAME);
        }
      }
    })
    this.filteredbranches[index] = this.allBranches.filter(m => m.brancH_CODE !== branch);
  }
  getBranchEmpDetailByRegion(regionCode: string, brCode: string, index: number) {

    var reqObJ = {
      RegionCode: regionCode,
      BranchCode: brCode
    }
    this.surprisecash.getBranchEmpDetailByRegion(reqObJ).subscribe((response: any) => {
      if (response.status == 'success') {
        this.BranchesEmpdetail[index] = response.data;
        //this.annexureOneForm.controls['ToBranchOfficierBranchName'].setValue(response.rData.brancH_NAME)
      }
    })
  }
  getBranchOfficier(event: Event, index: number, branchGroup: AbstractControl): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value
    let current = this.loginservice.encryptstring(this.selectedValue);
    let emp_name = this._persistanceService.getSessionStorage('emp_name');
    this.surprisecash.getUserDataAfterLogin(current).subscribe((response: any) => {
      if (response.status == 'success') {
        let decryptData = JSON.parse(this.loginservice.decryptData(response.rData))
        const officersArray = this.getOfficersFormArray;
        const branchIndex = officersArray.controls.indexOf(branchGroup);
        const control = officersArray.at(branchIndex);
        if (control) {
          control.get('ToBranchOfficierDesignation')?.setValue(decryptData.EMP_DESGN_DESC)
          control.get('ToBranchOfficierName')?.setValue(decryptData.EMP_NAME)
          control.get('ToBranchOfficierBranchName')?.setValue(decryptData.LOCATION_DESC)
          control.get('BranchEmpId')?.setValue(decryptData.EMP_ID)
          control.get('FromRegionName2')?.setValue(decryptData.REGION_NAME)
          control.get('FromRegionHead')?.setValue(emp_name)
          control.get('IoBranchCode')?.setValue(decryptData.BR_CODE)
        }
      }
    })
  }

  resetForm() {
    window.location.reload();
  }

  addannexureone(stepper: any) {
    if (this.annexureOneForm.valid) {
      var reqObj = this.annexureOneForm.value
      reqObj.FinancialYear = this.fyfinancialyear.nativeElement.value;
      reqObj.Quater = this.fyquarter.nativeElement.value;
      reqObj.FullFinancialYear = this.fyfullyear.nativeElement.value;
      reqObj.ZoneCode = this.annexureOneForm.get('ZoneCode')?.value;
      reqObj.RegionCode = this.annexureOneForm.get('RegionCode')?.value;
      reqObj.LoggedUserId = this.annexureOneForm.get('LoggedUserId')?.value;
      this.surprisecash.addAnnexureOneDetails(reqObj).subscribe((response: any) => {
        if (response.status == 'success') {
          this.annexureOneForm.disable;
          this.submitButtonAnnexure1 = false;
          this.showPrintButton = true;
          this.notifier.success(response.message);
          //stepper.next();
          this.showResetButton = true;
          this.generatedRefNos = response.rData;
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureOneForm.markAllAsTouched();
    }
  }

  addannexuretwo(stepper: any) {
    //if (this.annexureTwoForm.valid) {
    let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
    let CreatedBy = currentUser;
    let AnnexureStatus = "Saved";
    var reqObj = this.annexureTwoForm.value
    reqObj.OpeningClosingOfBusinessAmount = this.annexureTwoForm.get('OpeningClosingOfBusinessAmount')?.value.toString();
    let BranchCode = this._persistanceService.getSessionStorage('branch_code');
    let RegionCode = this._persistanceService.getSessionStorage('region_code');
    let ZoneCode = this._persistanceService.getSessionStorage('zone_code');
    let ZoneName = this._persistanceService.getSessionStorage('zone_name');
    let FinancialYear = this._persistanceService.getSessionStorage('Financial_Year');
    let Quater = this._persistanceService.getSessionStorage('Quater');
    let SVBranchCode = BranchCode.data;
    const postData = { ...reqObj, AnnexureStatus, CreatedBy, SVBranchCode, RegionCode, ZoneCode, ZoneName, FinancialYear, Quater, }


    this.surprisecash.addAnnexureTwoDetails(postData).subscribe((response: any) => {
      if (response.status == 'success') {
        this.formSubmitted = true;
        //this.annexureTwoForm.disable();
        //this.showbutton = false;
        this.notifier.success(response.message);
        //stepper.next();
        this.checkAnnexureOneDetailsByPFno();
        //window.location.reload();
      } else {
        this.notifier.error(response.message);
      }
    })
    //}
    // else {
    //   this.annexureTwoForm.markAllAsTouched();
    // }
  }

  submitannexuretwo(stepper: any) {
    if (this.annexureTwoForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let CreatedBy = currentUser;
      let AnnexureStatus = "Submitted-Disable";
      var reqObj = this.annexureTwoForm.value
      reqObj.OpeningClosingOfBusinessAmount = this.annexureTwoForm.get('OpeningClosingOfBusinessAmount')?.value.toString();
      let BranchCode = this._persistanceService.getSessionStorage('branch_code');
      let RegionCode = this._persistanceService.getSessionStorage('region_code');
      let ZoneCode = this._persistanceService.getSessionStorage('zone_code');
      let ZoneName = this._persistanceService.getSessionStorage('zone_name');
      let FinancialYear = this._persistanceService.getSessionStorage('Financial_Year');
      let Quater = this._persistanceService.getSessionStorage('Quater');
      let SVBranchCode = BranchCode.data;
      const postData = { ...reqObj, AnnexureStatus, CreatedBy, SVBranchCode, RegionCode, ZoneCode, ZoneName, FinancialYear, Quater, }



      this.surprisecash.addAnnexureTwoDetails(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.formSubmitted = true;
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.annexureTwoForm.get('SelectDesc')?.disable();
          this.showbutton = false;
          this.notifier.success(response.message);
          //stepper.next();
          //this.checkAnnexureOneDetailsByPFno();
          //window.location.reload();
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureTwoForm.markAllAsTouched();
    }
  }

  addannexurethree(stepper: any) {
    if (this.annexureThreeForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let CreatedBy = currentUser;
      var reqObj = this.annexureThreeForm.value
      let AnnexureStatus = 'Submitted';
      let RegionCode = this._persistanceService.getSessionStorage('region_code');
      let ZoneCode = this._persistanceService.getSessionStorage('zone_code');
      const postData = { ...reqObj, CreatedBy, RegionCode, ZoneCode, AnnexureStatus }
      this.surprisecash.addAnnexureThreeDetails(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.formSubmitted = true;
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.notifier.success(response.message);
          //stepper.next();
          window.location.reload();
        } else {
          this.notifier.error(response.message);
        }
      })
    }
    else {
      this.annexureThreeForm.markAllAsTouched();
    }
  }

  addannexurefour(stepper: any) {

    if (this.annexureFourForm.valid) {
      let currentUser = this.loginservice.decryptData(this._persistanceService.getSessionStorage(LocalStorageVariable.CURRENT_USER));
      let CreatedBy = currentUser;
      var reqObj = this.annexureFourForm.value
      let AnnexureStatus = 'Submitted';
      let ZoneCode = this._persistanceService.getSessionStorage('zone_code');
      let ZoneName = this._persistanceService.getSessionStorage('zone_name');
      const postData = { ...reqObj, CreatedBy, ZoneCode, ZoneName, AnnexureStatus }


      //reqObj.ZoneCode = this.annexureOneForm.get('ZoneCode')?.value
      //reqObj.RegionCode = this.annexureOneForm.get('RegionCode')?.value
      //reqObj.LoggedUserId = this.annexureOneForm.get('LoggedUserId')?.value
      //reqObj.BranchEmpId = this.annexureOneForm.get('BranchEmpId')?.value
      //reqObj.BranchEmpId = this.annexureOneForm.get('BranchEmpId')?.value
      this.surprisecash.addAnnexureFourDetails(postData).subscribe((response: any) => {
        if (response.status == 'success') {
          this.formSubmitted = true;
          this.annexureTwoForm.disable();
          this.annexureTwoForm.get('FinancialYearTwo')?.enable();
          this.annexureTwoForm.get('QuaterTwo')?.enable();
          this.notifier.success(response.message);
          //stepper.next();
          window.location.reload();
        } else {
          this.notifier.error(response.message);
        }
      })
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  printForm() {
    let popupWin;
    let printContent = '';
    let FromRegionName = this.annexureOneForm.get('FromRegionName')?.value;

    this.getOfficersFormArray.controls.forEach((officerGroup: AbstractControl, index: number) => {
      const ToBranchOfficierName = officerGroup.get('ToBranchOfficierName')?.value;
      const ToBranchOfficierDesignation = officerGroup.get('ToBranchOfficierDesignation')?.value;
      const ToBranchOfficierBranchName = officerGroup.get('ToBranchOfficierBranchName')?.value;
      const ToBranchOfficierBranchName1 = officerGroup.get('ToBranchOfficierBranchName1')?.value;
      const ApplicationDate = officerGroup.get('ApplicationDate')?.value;
      const ICNo = officerGroup.get('ICNo')?.value;
      const ICNoDate = officerGroup.get('ICNoDate')?.value;
      const IOBranchCode = officerGroup.get('IoBranchCode')?.value;
      const SVBranchCode = officerGroup.get('SvBranchCode')?.value;

      const refNumber = this.generatedRefNos[index];

      printContent += `
        <div style="page-break-after: always;">
        <img src='assets/images/logo.png' width='800'></img>
        <div class="row m-auto mt-5 office_letter">
            <h3><i>lnter Office Letter</i></h3>
            <h4>(confidential Letter)</h4>
            <div class="table-from mt-3">
                <table class="table">
                    <tr>
                        <td>
                            <div class="p-3 table-box">
                                <h5>From : </h5>
                                <p class="d-flex align-items-center gap-1 m-1 p-0"> DYRH-Operations :
                                </p>
                                <p class="d-flex align-items-center gap-1 mt-3 p-0 m-0">Regional Office :
                                    ${FromRegionName}
                                </p>
                            </div>
                        </td>
                        <td>
                            <div class="p-3 table-box">
                                <h5>To : ${ToBranchOfficierName}</h5>

                                <p class="d-flex align-items-center gap-1 mt-3 m-0 p-0"> Designation :
                                    ${ToBranchOfficierDesignation}
                                </p>
                                <p class="d-flex align-items-center gap-1 mt-3 p-0">Branch/Office :
                                    ${IOBranchCode}-${ToBranchOfficierBranchName}

                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="d-flex justify-content-between mt-2">
                    <p>RefNo: ${refNumber}</p>
                    <p class="d-flex align-items-center gap-1 m-0 p-0"> Date : ${ApplicationDate} </p>
                </div>
                <div>
                    <p class="sub mt-4"><b>Sub : </b> <u> Report on Surprise Verification of Cash/Handling
                            of Cash & Keys/Verification
                            of Valuables</u></p>
                    <p class="mt-5"><b>Dear Sir/Madam,</b></p>
                    <p class="mt-5">We shall Like to inform you that you are nominated for carrying out the
                        Surprise Cash
                        Verification for the <b>Branch</b> &nbsp; ${SVBranchCode}-${ToBranchOfficierBranchName1}</p>
                    <p class="mt-5">Please conduct the lnspection as per the <b>lC No :</b>
                        &nbsp;${ICNo}
                        <b>dated</b>&nbsp;${ICNoDate}
                        &nbsp;and submit the
                        report in the cash Verification Portal.
                    </p>
                    <p class="mt-5">Please note that the inspection should be conducted immediatety.</p>
                    <p class="mt-5">Please note that this is a Confidential exercise and should not disclose
                        to Branch/Officials
                        <!-- to &nbsp;&nbsp;
                                    <input type="text" placeholder="Branch/Officials" class="w-25" formControlName="IoBranchCode"> -->
                    </p>
                    <p class="text-end mt-4 pt-4"><b> Dy RegionaI Head Operation/Head of Operation </b></p>
                    <p class="text-end"><b>Regional Office:</b> &nbsp; ${FromRegionName}</p>
                </div>

            </div>
        </div>
    </div>
        `;

    });
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="styles.css">
        </head>
        <body onload="window.print();window.close()">
           ${printContent}
        </body>
        </html>
        `);
    popupWin?.document.close();
  }

  printFormAfterNomination(item: any) {
    let popupWin;
    let FromDyRH = this._persistanceService.getSessionStorage('emp_name');
    let FromRegionName = item.AnnexureOneData.FROM_REGION_NAME
    let ToBranchOfficierName = item.AnnexureOneData.TO_BRANCH_OFFICER_NAME
    let ToBranchOfficierDesignation = item.AnnexureOneData.TO_BRANCH_OFFICER_DESIGNATION
    let ToBranchOfficierBranchName = item.AnnexureOneData.TO_BRANCH_OFFICER_BRANCH_NAME
    let SVBranchCode = item.AnnexureOneData.SV_BRANCH_CODE
    let ApplicationDate = item.AnnexureOneData.APPLICATION_DATE
    let ICNo = item.AnnexureOneData.IC_NO
    let ICNoDate = item.AnnexureOneData.IC_NO_DATE
    let InspectionBranch = item.AnnexureTwoData.NAME_OF_BRANCH;
    let ref_No = item.AnnexureOneData.REF_NO;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
          <html>
          <head>
          <link rel="stylesheet" type="text/css" href="styles.css">
          </head>
          <body onload="window.print();window.close()">
          <img src='assets/images/logo.png' width='800'></img>
          <div class="row m-auto mt-5 office_letter" id="print-section" #formRef>
                        <h3><i>lnter Office Letter</i></h3>
                        <h4>(confidential Letter)</h4>
                        <div class="table-from mt-3">
                            <table class="table">
                                <tr>
                                    <td>
                                        <div class="p-3 table-box">
                                            <h5>From : </h5>
                                            <p class="d-flex align-items-center gap-1 m-1 p-0"> DYRH-Operations :
                                            ${FromDyRH}
                                            </p>
                                            <p class="d-flex align-items-center gap-1 mt-3 p-0 m-0">Regional Office :
                                             ${FromRegionName}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="p-3 table-box">
                                            <h5>To : ${ToBranchOfficierName}</h5>

                                            <p class="d-flex align-items-center gap-1 mt-3 m-0 p-0"> Designation :
                                            ${ToBranchOfficierDesignation}
                                            </p>
                                            <p class="d-flex align-items-center gap-1 mt-3 p-0">Branch/Office :
                                            ${SVBranchCode}-${ToBranchOfficierBranchName}

                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div class="d-flex justify-content-between mt-2">
                                <p>RefNo: ${ref_No}</p>
                                <p class="d-flex align-items-center gap-1 m-0 p-0"> Date : ${ApplicationDate} </p>
                            </div>
                            <div>
                                <p class="sub mt-4"><b>Sub : </b> <u> Report on Surprise Verification of Cash/Handling
                                        of Cash & Keys/Verification
                                        of Valuables</u></p>
                                <p class="mt-5"><b>Dear Sir/Madam,</b></p>
                                <p class="mt-5">We shall Like to inform you that you are nominated for carrying out the
                                    Surprise Cash
                                    Verification for the <b>Branch</b> &nbsp; ${InspectionBranch}</p>
                                <p class="mt-5">Please conduct the lnspection as per the <b>lC No :</b>
                                    &nbsp;${ICNo}
                                    <b>dated</b>&nbsp;${ICNoDate}
                                    &nbsp;and submit the
                                    report in the cash Verification Portal.
                                </p>
                                <p class="mt-5">Please note that the inspection should be conducted immediatety.</p>
                                <p class="mt-5">Please note that this is a Confidential exercise and should not disclose
                                    to Branch/Officials
                                    <!-- to &nbsp;&nbsp;
                                    <input type="text" placeholder="Branch/Officials" class="w-25" formControlName="IoBranchCode"> -->
                                </p>
                                <p class="text-end mt-4 pt-4"><b> Dy RegionaI Head Operation/Head of Operation </b></p>
                                <p class="text-end"><b>Regional Office:</b> &nbsp; ${FromRegionName}</p>
                                <p class="text-end">(_______________________)</p>
                            </div>

                        </div>
                    </div></body>
          </html>
    `);
    //window.print();
    popupWin?.document.close();
  }
  discrepancyQuestions = [
    { key: 'KEY_REGISTER_KEPT_UNDER_JOINT_CUSTODY_NO', label: 'Kept under joint Custody' },
    { key: 'KEY_REGISTER_WHETHER_KEY_REGISTER_MAINTAINED_NO', label: 'Whether Key Register Maintained and is updated' },
    { key: 'KEY_REGISTER_DUPTICATE_SET_OF_CASH_KEYS_NO', label: 'Duplicate Set of Cash Keys are Kept as per Guidelines' },
    { key: 'KEY_REGISTER_MASTER_KEY_OF_THE_LOCKERS_NO', label: 'Master Key of the lockers held in the double Locker' },
    { key: 'SAFETY_SECURITY_FOUND_THAT_BURGLARY_ALARM_SYSTEM_NO', label: 'I found that the Burglary Alarm System is/ is not in proper working condition' },
    { key: 'WHETHER_ULTRAVIOLET_LAMP_PROVIDED_NO', label: 'Whether Ultraviolet Lamp is Provided' },
    { key: 'WHETHER_ULTRAVIOLET_LAMP_WORKING_NO', label: 'Whether Ultraviolet Lamp Working' },
    { key: 'CCTV_SYSTEM_IS_PROVIDED_NO', label: 'Whether CCTV System is Provided' },
    { key: 'CCTV_SYSTEM_IS_WORKING_NO', label: 'Whether CCTV System is Working' },
    { key: 'CCTV_RECORDING_OF_LAST_90DAYS_AVAILABLE_NO', label: 'Whether CCTV Recording of last 90 days is available' },
    { key: 'CASH_COUNTING_MACHINE_PROVIDED_NO', label: 'Whether Cash Counting Machine is Provided' },
    { key: 'CASH_COUNTING_MACHINE_WORKING_NO', label: 'Whether Cash Counting Machine is Working' },
    { key: 'WHETHER_BRANCH_HAS_CONDUCTED_SURPRISE_CASH_NO', label: 'Whether Branch has conducted surprise Cash verification in off-site ATM, if done date of verification and discrepancies found if any' },
    { key: 'PHYSICAL_CASH_IN_ATM_VERIFIED_NO', label: 'Physical Cash in ATM (On-Site) verified with Finacle/CBS system and tallied.' },
    { key: 'WHETHERMACHINESORTEDNOTESNO', label: 'Whether machine sorted Notes are fed to ATM or disbursed over the counter' },
    { key: 'WHETHERAVAITABITITYOFNAMNO', label: 'Whether, availability of NAM (note authentication machine)/NSM (note sorting machine) is sufficient and is being used by the counter staff' },
    { key: 'WHETHERFIRNO', label: 'Whether FIR is lodged with Police Dept through Nodal officer (DyRH) on detection of 5 or more counterfeit notes in a single transaction and records thereof is maintained' },
    { key: 'MONTHTYCONSOTIDATEDREPORTNO', label: 'Whether Monthly consolidated Report on counterfeit notes detected during the month is submitted to Police dept through Nodal Officer (DyRH) and records thereof is maintained' },
  ]
  getFilteredDiscrepancyQuestions(item: any) {
    return this.discrepancyQuestions.filter(x => item[x.key]);
  }
  getLatestSurpriseDate(svBranchCode: string) {
    this.surprisecash.getLatestSurpriseDate(svBranchCode).subscribe((response: any) => {
      const apiDate = response?.rData;
      const formattedDate = apiDate
        // ? this.formatDate(new Date(apiDate)) // use API date
        ? apiDate // use API date
        : this.formatDate(new Date());       // fallback to current date
      this.annexureTwoForm.patchValue({
        DateOfPrevSurpriseVerification: formattedDate
      });
    },
      (error: any) => {
        // In case of error, fallback to current date
        this.annexureTwoForm.patchValue({
          DateOfPrevSurpriseVerification: this.formatDate(new Date())
        });
      });
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`
  }

  AddBranches(): void {
    const newBranch = new FormGroup({
      SvBranchCode: new FormControl('', Validators.required),
      IoBranchCode: new FormControl('', Validators.required),
      BranchManagerName: new FormControl('', Validators.required)
    });
    (<FormArray>this.annexureOneForm.get('newBranches')).push(newBranch);
    let regionHead = this.annexureOneForm.get('FromRegionHead')?.value;
    let regionName = this.annexureOneForm.get('FromRegionName')?.value;

    const officerGroup =
      new FormGroup({
        ToBranchOfficierBranchName1: new FormControl(''),
        ToBranchOfficierBranchName: new FormControl(''),
        ToBranchOfficierDesignation: new FormControl(''),
        ToBranchOfficierName: new FormControl(''),
        BranchEmpId: new FormControl(''),
        FromRegionHead: new FormControl(regionHead),
        FromRegionName2: new FormControl(regionName),
        ApplicationDate: new FormControl(this.getCurrentDate()),
        ICNo: new FormControl("05056-2024"),
        ICNoDate: new FormControl("2024-08-17"),
        SvBranchCode: new FormControl(''),
        IoBranchCode: new FormControl(''),
      });
    (<FormArray>this.annexureOneForm.get('officers')).push(officerGroup);
    this.isNext = true;
  }

  onDeleteBranches(branchGroup: AbstractControl): void {
    const branchesArray = this.getBranchesArray;
    const officersArray = this.getOfficersFormArray;
    const branchIndex = branchesArray.controls.indexOf(branchGroup);

    if (branchIndex > -1) {
      branchesArray.removeAt(branchIndex);
      officersArray.removeAt(branchIndex);
    }
  }
  updateFilteredBranchesForIndex(index: number): any[] {
    const branchesArray = this.getBranchesArray;
    const selectedSvCodesExceptCurrent = branchesArray.controls.map((control, i) => {
      if (i == index)
        return null;
      const value = control.get('SvBranchCode')?.value;
      return value ? value.split('-')[0] : '';
    })
      .filter((code: any) => code);
    let branchesList = this.allBranches.filter(x => !selectedSvCodesExceptCurrent.includes(x.brancH_CODE));
    return branchesList;
  }
  get getBranchesArray() {
    return this.annexureOneForm.get('newBranches') as FormArray;
  }
  get getOfficersControls() {
    return (this.annexureOneForm.get('officers') as FormArray).controls;
  }
  get getOfficersFormArray(): FormArray {
    return this.annexureOneForm.get('officers') as FormArray;
  }
  getOfficerFormGroup(index: number): FormGroup {
    return this.getOfficersFormArray.at(index) as FormGroup;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onNextClick(): void {
    if (this.currentIndex < this.getOfficersControls.length - 1) {
      this.currentIndex++;
    }
  }
  onPreviousClick(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  onSelection(selectedValue: string): void {
    this.annexureTwoForm.controls['cashSelectionType'].setValue(selectedValue);
    // Handle logic based on selected value
    const svBranchCode = this._persistanceService.getSessionStorage('branch_code');
    this.fetchCashDetails(svBranchCode.data, selectedValue);
  }

  private fetchCashDetails(branchCode: string, selectionType: string): void {
    const postData = { branchCode, selectionType };
    this.surprisecash.getDenominationsCashDetails(postData).subscribe({
      next: (response: any) => {
        if (response.status == 'success') {
          const decryptData = response.rData;
          const date = new Date(decryptData.selectionTypeDate);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          // Set form values
          this.annexureTwoForm.patchValue({
            Notes2000: decryptData.noteS_2000,
            Notes500: decryptData.noteS_500,
            Notes200: decryptData.noteS_200,
            Notes100: decryptData.noteS_100,
            Notes50: decryptData.noteS_50,
            Notes20: decryptData.noteS_20,
            Notes10: decryptData.noteS_10,
            Notes5: decryptData.noteS_5,
            Notes2: decryptData.noteS_2,
            Notes1: decryptData.noteS_1,
            Coins20: decryptData.coinS_20,
            Coins10: decryptData.coinS_10,
            Coins5: decryptData.coinS_5,
            Coins2: decryptData.coinS_2,
            Coins1: decryptData.coinS_1,
            Coins50Paisa: decryptData.coinS_50_PAISA,
            OpeningClosingOfBusiness: formattedDate,
          });
          // Set total amounts
          this.Total2000Amount = decryptData.total2000Amount;
          this.Total500Amount = decryptData.total500Amount;
          this.Total200Amount = decryptData.total200Amount;
          this.Total100Amount = decryptData.total100Amount;
          this.Total50Amount = decryptData.total50Amount;
          this.Total20Amount = decryptData.total20Amount;
          this.Total10Amount = decryptData.total10Amount;
          this.Total5Amount = decryptData.total5Amount;
          this.Total2Amount = decryptData.total2Amount;
          this.Total1Amount = decryptData.total1Amount;
          this.Total20AmountCoins = decryptData.total20AmountCoins;
          this.Total10AmountCoins = decryptData.total10AmountCoins;
          this.Total5AmountCoins = decryptData.total5AmountCoins;
          this.Total2AmountCoins = decryptData.total2AmountCoins;
          this.Total1AmountCoins = decryptData.total1AmountCoins;
          this.Total50PaisaAmountCoins = decryptData.total50PaisaAmountCoins;

          this.calculateTotalSum();
        } else {
          this.notifier.error(response.message);
          this.resetAnnexureTwoFromCash();
        }
      },
      error: (error: any) => {
        console.error('Failed to fetch data:', error);
      }
    });
  }

  private resetAnnexureTwoFromCash(): void {
    this.annexureTwoForm.patchValue({
      Notes2000: '',
      Notes500: '',
      Notes200: '',
      Notes100: '',
      Notes50: '',
      Notes20: '',
      Notes10: '',
      Notes5: '',
      Notes2: '',
      Notes1: '',
      Coins20: '',
      Coins10: '',
      Coins5: '',
      Coins2: '',
      Coins1: '',
      Coins50Paisa: '',
      OpeningClosingOfBusiness: '',
      OpeningClosingOfBusinessAmount: ''
    });
    this.Total2000Amount = 0;
    this.Total500Amount = 0;
    this.Total200Amount = 0;
    this.Total100Amount = 0;
    this.Total50Amount = 0;
    this.Total20Amount = 0;
    this.Total10Amount = 0;
    this.Total5Amount = 0;
    this.Total2Amount = 0;
    this.Total1Amount = 0;
    this.Total20AmountCoins = 0;
    this.Total10AmountCoins = 0;
    this.Total5AmountCoins = 0;
    this.Total2AmountCoins = 0;
    this.Total1AmountCoins = 0;
    this.Total50PaisaAmountCoins = 0;
    this.TotalSum = 0;
  }
  onRejected(event: { showApproved: boolean, showRejected: boolean }) {
    this.showApprovedbutton = event.showApproved;
    this.showRejectbutton = event.showRejected;
    // console.log("updated from child: ", event)
  }
}