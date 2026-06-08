# 🏦 UNION BANK OF INDIA — Surprise Cash Verification (SCV) System
## Complete Production Codebase Audit Report

**Project:** Surprise Cash Verification System  
**Organization:** Union Bank of India  
**Date:** 7 June 2026 (Updated: 8 June 2026 with developer clarifications)  
**Status:** Live Production (UAT + Production environments)  
**Codebase Reviewed:** Dev/UAT branch (some testing configurations differ from production — noted below)

> [!IMPORTANT]
> **Developer Clarifications (8 June 2026):**
> - The `validate = true` AD bypass in this branch is **dev/test only**. Production has proper AD validation enabled.
> - The hardcoded SMS number (`917075470987`) is **dev/test only**. Production sends to the actual officer's phone number.
> - The AdminController has **no backend `[Authorize]`** by design — only the developer and one business person use it, with a frontend-level hardcoded password. However, the backend API endpoints remain publicly accessible (see advisory in Section 8).

---

## 1. WHAT THIS PROJECT DOES (End-to-End)

The **Surprise Cash Verification (SCV)** system is an internal banking application used by Union Bank of India to conduct **surprise inspections of branch cash holdings**. The system digitizes the entire inspection workflow — from nomination of inspecting officers, through on-site cash verification, to compliance reporting up the chain of command.

### Business Flow:
1. **Deputy Regional Head (DYRH)** nominates an Inspecting Officer (IO) to surprise-verify cash at a specific branch
2. The **IO visits the branch**, physically counts all cash (denomination-wise), checks security systems (CCTV, alarms, strong room doors, UV lamps, note sorting machines), and fills the digital inspection report
3. The report flows up the hierarchy: **IO → DYRH (Approve/Reject) → Branch Head (Comply) → Regional Officer (Comply) → Zonal Officer (Comply) → Central Office (Comply)**
4. At each level, discrepancies are tracked and action is taken
5. Consolidated reports (Annexure III, IV, V) aggregate data at regional, zonal, and central levels
6. The system integrates with **Finacle** (core banking) to fetch real-time cash denomination data

---

## 2. FULL ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR 19 FRONTEND (SCV_UI)                 │
│  Hash-based routing (#/login, #/annexure, #/admin-list)         │
│  Angular Material + Bootstrap 5 + ngx-toastr + SweetAlert2      │
│  AES Encryption (CryptoJS) for all sensitive data               │
│  Session-based auth (token in sessionStorage)                    │
├─────────────────────────────────────────────────────────────────┤
│                         HTTPS / REST                            │
├─────────────────────────────────────────────────────────────────┤
│                   .NET 8.0 WEB API BACKEND                      │
│  3 Controllers: Account, Admin, SurpriseCashVerification        │
│  3 Service classes (UserMgmt, Admin, SCV)                       │
│  JWT Authentication (HmacSha256, 120-min expiry)                │
│  AES-256 Encryption/Decryption (EncryptoData.cs)                │
│  AutoMapper for DTO mapping                                     │
│  Serilog for file-based logging                                 │
│  Custom JWT Middleware + AuthorizeAttribute                      │
├─────────────────────────────────────────────────────────────────┤
│               DATABASES (2 separate databases)                  │
│  ┌───────────────────────┐  ┌─────────────────────────────────┐ │
│  │  ORACLE DB            │  │  SQL SERVER DB                  │ │
│  │  (SurpriseCashDb)     │  │  (OrganisationsDb)              │ │
│  │  10 core tables       │  │  3 tables                       │ │
│  │  12 backup tables     │  │  - STAFF_DETAILS (emp master)   │ │
│  │  0 stored procedures  │  │  - Branch_master                │ │
│  │  0 triggers           │  │  - Questions (captcha)          │ │
│  │  0 foreign keys       │  │                                 │ │
│  └───────────────────────┘  └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                   EXTERNAL API INTEGRATIONS                     │
│  1. Active Directory (AD) - User validation                     │
│  2. Finacle (Core Banking) - Cash denomination data             │
│  3. SMS/OTP API (ICMT) - Nomination notifications               │
│  4. MyDairy - SSO decryption                                    │
│  5. EncryDecry Service - Payload encryption for Finacle         │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Communication:
- **Frontend → Backend**: HTTP REST calls with `Authorization: Bearer <JWT>` header (via interceptor), all sensitive data AES-encrypted
- **Backend → Oracle DB**: Entity Framework Core with raw SQL (⚠️ some with string interpolation = SQL injection risk)
- **Backend → SQL Server DB**: Entity Framework Core with raw SQL
- **Backend → External APIs**: `HttpClient` / `HttpWebRequest` with Basic Auth or API keys

---

## 3. ALL USER ROLES AND PERMISSIONS

| Role | Code | What They Can Do |
|------|------|------------------|
| **Inspecting Officer (IO)** | IO | Fill Annexure I (nominate branch), Fill Annexure II (cash verification report), Save/Submit reports, Print inter-office letter |
| **Deputy Regional Head (DYRH)** | DYRH | Create nominations (Annexure I), Approve/Reject IO submissions, Mark RO Complied/Not Complied, View Annexure III (regional consolidated), Delete Annexure I/II records |
| **Branch Head (BH)** | BH | View branch inspection reports, Mark Branch Complied/Not Complied |
| **Zonal Officer (ZO)** | ZO | View all branch and RO reports in zone, Mark ZO Complied/Not Complied, View/Submit Annexure IV (zonal consolidated) |
| **Central Office (CO)** | CO | View all reports system-wide, Mark CO Complied/Not Complied, View Annexure V (central consolidated), Request-A-Report feature |
| **Admin** | Admin | Manage LOGIN_TYPE entries (Add/Edit employees), Control who can log in (Allow/Not_Allow status) |

### Role Detection Flow:
```
Login → GetStaffDetailsAfterLogin (get designation from HR DB)
  → GetLogInType (check LOGIN_TYPE table for designation match)
    → If USER_TYPE = "CO" and location = "100000" → Central Office
    → If USER_TYPE = "ZO" → Zonal Officer
    → If USER_TYPE = "DYRH" → Deputy Regional Head
    → If USER_TYPE = "BH" → Branch Head
    → Default → Inspecting Officer (IO)
```

---

## 4. EVERY EXTERNAL API AND ITS PURPOSE

### 4.1 Active Directory (AD) Validation API
| Field | Value |
|-------|-------|
| **Owner** | Union Bank of India IT Infrastructure |
| **URL** | `http://app2.unionbankofindia.co.in:8222/MicroService/MicroService.svc/validateDomainUser` |
| **Method** | POST (SOAP/WCF) |
| **Auth** | Basic Auth — `microservice:Software@2021` |
| **Request** | `<validateDomainUser><empId>{id}</empId><pwd>{password}</pwd></validateDomainUser>` |
| **Response** | XML with `<validateDomainUserResult>true/false</validateDomainUserResult>` |
| **Purpose** | Validates employee credentials against bank's Active Directory |
| **ℹ️ Note** | In this dev/UAT branch, result is overridden to `validate = true` (line 239) for testing. **Production has proper AD validation enabled.** |

### 4.2 Finacle Cash Denomination API
| Field | Value |
|-------|-------|
| **Owner** | Union Bank Core Banking (Finacle/Infosys) |
| **URL** | `https://apimuat.unionbankofindia.co.in/.../FetchCashDetails` |
| **Method** | POST |
| **Auth** | API Key: `f1cc1d13accf4150bf66ecf498068228` |
| **Request** | Encrypted payload via EncryDecry service: `{branchCode, selectionType}` |
| **Response** | Denomination-wise cash details (2000, 500, 200, 100, 50, 20, 10 notes + coins) |
| **Purpose** | Fetches real-time cash position from core banking for comparison with physical count |

### 4.3 SMS/OTP API (ICMT)
| Field | Value |
|-------|-------|
| **Owner** | Union Bank Internal Communications |
| **URL** | `https://icmt.unionbankofindia.co.in/OTPAPI/` |
| **Method** | POST |
| **Request** | `{MobileNo, OTPMessage}` |
| **Purpose** | Sends SMS notification to branch officers when nominated for surprise cash verification |
| **ℹ️ Note** | In this dev/UAT branch, SMS sends to hardcoded test number `917075470987`. **Production sends to the actual officer's phone number.** |

### 4.4 Encryption/Decryption Service
| Field | Value |
|-------|-------|
| **Owner** | Union Bank Security Team |
| **Encrypt URL** | `https://app2.unionbankofindia.co.in/EncryDecryTomcat/EncryDecry256/get-encryptionpayload` |
| **Decrypt URL** | `https://app2.unionbankofindia.co.in/EncryDecryTomcat/EncryDecry256/get-decryptedpayload` |
| **Purpose** | Encrypts/decrypts payloads for Finacle API communication |

### 4.5 MyDairy Decryption API
| Field | Value |
|-------|-------|
| **Owner** | Union Bank MyDairy Team |
| **URL** | `https://app2.unionbankofindia.co.in/URLEncryptionAPI/api/Encryption/decrypt` |
| **Method** | POST |
| **Request** | `{encryptedText}` |
| **Purpose** | Decrypts SSO tokens from MyDairy application for auto-login |

---

## 5. COMPLETE USER FLOW (Login → Every Action)

### 5.1 Login Flow
```
User opens application
  → Redirected to /#/login
  → Login page loads captcha question from API (GetQuestions)
  → User enters PF Number + Password + Captcha answer
  → Frontend encrypts credentials with AES (CryptoJS)
  → POST to Account/validateDomainUser
    → Backend decrypts credentials
    → Calls AD API to validate (dev/test: bypassed with `validate=true`; production: proper AD validation)
    → Checks if concurrent login exists in USER_TOKEN table
      → If exists: returns "logged in another session" error
    → Generates JWT token (120-min expiry)
    → Stores token in USER_TOKEN table (HASH_TOKEN = hashed, LASTTOKEN = raw)
    → Returns: {userId, token, empName, pfNo}
  → Frontend stores token in sessionStorage
  → Checks if credentials match admin config → navigates to /admin-navbar or /annexure
```

### 5.2 SSO Flow (MyDairy)
```
User clicks SCV link in MyDairy app
  → URL contains ?data=<encrypted_token>
  → Login page detects query param
  → Calls MyDairyDecrypt API
  → Extracts userId|password from decrypted text
  → Auto-fills and submits login form
```

### 5.3 DYRH Nomination Flow (Annexure I)
```
DYRH logs in → sees Annexure I tab
  → Selects Financial Year, Quarter
  → System loads un-nominated branches (GetUnNominatedBranches)
  → DYRH selects IO (inspecting officer) and target branch
  → Submits nomination → POST AddAnnexureOneDetails
    → Backend saves to SURPRISE_CASH_ANNEXURE_1
    → Sends SMS notification to branch officer (dev: hardcoded test number; production: actual officer's number)
  → Nomination appears in grid
  → Can delete nomination (soft delete: IS_DELETED = 'Y')
  → Prints inter-office letter for IO
```

### 5.4 IO Inspection Flow (Annexure II)
```
IO logs in → sees Annexure I (their nominations) and Annexure II tabs
  → Selects a nomination → Opens Annexure II form
  → Selects BOD/EOD (Beginning/End of Day)
    → System fetches denomination data from Finacle API
    → Populates denomination fields
  → IO fills inspection checklist:
    - Cash denomination (physical count vs system count)
    - Safe custody receipts, postal stamps
    - Monthly cash verification compliance
    - Key register maintenance
    - Security checks (strong room, CCTV, burglary alarm, UV lamp)
    - ATM cash verification
    - Discrepancies found
  → Can SAVE (status = "Saved") or SUBMIT (status = "Submitted-Disable")
  → Once submitted, form becomes read-only
```

### 5.5 Approval/Compliance Chain
```
DYRH views submitted reports
  → Reviews Annexure II → APPROVE or REJECT
    → If REJECTED: adds comment (popup dialog)
    → If APPROVED: status = "Approved"
  → After approval: DYRH can mark "RO Complied" or "RO Not Complied"

Branch Head (BH) views approved reports
  → Can mark "Branch Complied" or "Branch Not Complied"

Zonal Officer (ZO) views all regional reports
  → Can mark "ZO Complied" or "ZO Not Complied"

Central Office (CO) views all zonal reports
  → Can mark "CO Complied" or "CO Not Complied"
```

**Status Lifecycle:**
```
Not Saved → Saved → Submitted-Disable → Approved/Rejected
  → Scrutinized → Complied By RO → Complied By ZO → Complied By CO
```

### 5.6 Admin Flow
```
Admin logs in (hardcoded credentials from config.json — used only by developer and business person)
  → Frontend checks encrypted admin username/password from assets/config.json
  → On match: navigated to /admin-navbar → /admin-list
  → Views paginated list of employees in LOGIN_TYPE
  → Can ADD new employee:
    - Select User Type (CO/DYRH/BH/ZO)
    - Enter Employee ID → system auto-fills from HR database
    - Set Status (Allow/Not_Allow)
  → Can EDIT existing employee (change status only)
```
> [!NOTE]
> **Design Decision:** Admin panel access is intentionally limited to the developer and one business person. Authentication is handled via hardcoded encrypted credentials on the frontend only. The backend Admin API endpoints do not require JWT authentication (see advisory in Section 8).

### 5.7 Reporting & Export
```
RO → Annexure III: Regional consolidated report with discrepancies
ZO → Annexure IV: Zonal consolidated report
CO → Annexure V: Central office consolidated report
All roles → Export to Excel (.xlsx) via ExcelService
All roles → Print forms as inter-office letter
```

---

## 6. DATABASE SCHEMA SUMMARY

### Oracle Database — 10 Core Tables

| Table | Purpose | PK? | FK? | Rows (est.) |
|-------|---------|-----|-----|-------------|
| SURPRISE_CASH_ANNEXURE_1 | Inspection nominations | ✅ | ❌ | ~79K+ |
| SURPRISE_CASH_ANNEXURE_2 | Detailed inspection reports (137 columns!) | ❌ | ❌ | ~50K+ |
| SURPRISE_CASH_ANNEXURE_3 | Regional consolidated reports (in EF, not in SQL) | – | – | – |
| SURPRISE_CASH_ANNEXURE_4 | Zonal consolidated reports (in EF, not in SQL) | – | – | – |
| BRANCH_USER_ACCESS | RO→Branch user mapping | ❌ | ❌ | ~130+ |
| CASH_DENOMINATION | Cash denomination records | ✅ | ❌ | Low |
| LOGIN_TYPE | User role/designation config | ✅ | ❌ | ~13 |
| STAFF_ROLES | Role master (DYRH, BH, CO, ZO) | ✅ | ❌ | 4 |
| STATUS_OF_REPORT_BY_DYRH | Report tracking by DYRH | ✅ | ❌ | Low |
| USER_TOKEN | Active session tokens | ✅ | ❌ | ~138K+ |
| ADMINS | Admin PF numbers | ❌ | ❌ | 4 |
| USERS | General user management | ✅ | ❌ | Low |

### SQL Server Database — 3 Tables

| Table | Purpose |
|-------|---------|
| STAFF_DETAILS | Employee master (from HR system) |
| Branch_master | Branch master data |
| Questions | Captcha math questions |

> [!CAUTION]
> **ZERO foreign keys exist anywhere in the entire schema.** No referential integrity is enforced at the database level. All data consistency depends entirely on application code.

---

## 7. 🔴 BUGS & ISSUES ALREADY SPOTTED

> [!NOTE]
> Items marked **[DEV-ONLY]** are testing configurations in this dev/UAT branch that are confirmed by the developer to be properly configured in production. Items marked **[BY DESIGN]** are intentional architectural decisions acknowledged by the developer.

### CRITICAL BUGS

| # | Bug | Location | Impact | Status |
|---|-----|----------|--------|--------|
| ~~1~~ | ~~**AD validation bypassed** — `validate = true` hardcoded~~ | ~~UserManagementServices.cs line 239~~ | ~~ANY credentials accepted~~ | **[DEV-ONLY]** ✅ Production has proper AD validation |
| 2 | **SQL Injection** — Raw SQL with string interpolation from user input | [UserManagementServices.cs](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification/Surprise_Cash_Verification/Services/UserManagementServices.cs) line 96 | Database compromise, data theft | 🔴 ACTIVE in production |
| 3 | **SQL Injection** — More raw SQL with interpolated values | [SurpriseCashVerificationService.cs](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification/Surprise_Cash_Verification/Services/SurpriseCashVerificationService.cs) lines 242-244, 998-1000 | Database compromise | 🔴 ACTIVE in production |
| 4 | **`/annexure` route has NO AuthGuard** — main business page unprotected | [app.routes.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/app.routes.ts) line 7 | Unauthenticated access to all inspection data | 🔴 ACTIVE in production |
| 5 | **AdminController has NO `[Authorize]` attribute** — backend APIs open | [AdminController.cs](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification/Surprise_Cash_Verification/Controllers/AdminController.cs) | APIs callable via Postman/curl without token | **[BY DESIGN]** ⚠️ See advisory below |
| 6 | **Dockerfile copies from wrong path** — `icaap-app` instead of `scv-ui` | [Dockerfile](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/Dockerfile) line 10 | Docker build will FAIL | 🔴 ACTIVE |
| 7 | **Annexure II form validation bypassed** — `.valid` check commented out | [surprise-cash.component.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/modules/surprise-cash/surprise-cash.component.ts) line ~4300 | Invalid data can be submitted | 🔴 ACTIVE in production |
| ~~8~~ | ~~**SMS goes to hardcoded number**~~ | ~~SurpriseCashVerificationService.cs line 247~~ | ~~Officers not notified~~ | **[DEV-ONLY]** ✅ Production sends to real number |
| 9 | **SURPRISE_CASH_ANNEXURE_2 has NO Primary Key** | SQL DDL | Duplicate records possible in the most critical table | 🔴 ACTIVE in production |
| 10 | **SV_BRANCH_CODE type mismatch** — VARCHAR2 in Annexure_1 vs NUMBER in Annexure_2 | SQL DDL | Join failures, implicit conversion errors | 🔴 ACTIVE in production |

> [!WARNING]
> **Advisory on #5 (AdminController):** The frontend password provides UI-level access control, but the 7 backend Admin API endpoints (`api/Admin/*`) are callable by anyone with tools like Postman or curl — no JWT token required. This is accepted as a design decision since only 2 people use this feature, but be aware the backend is exposed.

### HIGH-SEVERITY BUGS

| # | Bug | Location | Impact |
|---|-----|----------|--------|
| 11 | Interceptor `UserId` header overwritten — never actually sent | [user.interceptor.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/common/helpers/user.interceptor.ts) lines 14-26 | Backend never receives UserId header |
| 12 | `closepopup()` missing parentheses on emit | [dialog-popup.component.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/modules/dialog-popup/dialog-popup.component.ts) line 42 | Popup close event never fires |
| 13 | Logout shows success toast BEFORE API call completes | [header.component.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/modules/common/header/header.component.ts) lines 48-60 | Misleading UX, potential token not cleared |
| 14 | Delete Annexure-1 also deletes Annexure-2 by officer NAME not REF_NO | [SurpriseCashVerificationService.cs](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification_API-uat/Surprise_Cash_Verification/Surprise_Cash_Verification/Services/SurpriseCashVerificationService.cs) line ~1475 | Wrong Annexure-2 records could be deleted |
| 15 | ICNo and ICNoDate hardcoded to `"05056-2024"` and `"2024-08-17"` | [surprise-cash.component.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/modules/surprise-cash/surprise-cash.component.ts) lines 354-355 | All nominations get the same IC number |
| 16 | Delete endpoints use `[HttpGet]` instead of `[HttpDelete]`/`[HttpPost]` | AdminController.cs, SurpriseCashVerificationController.cs | CSRF vulnerability — deletion via URL |
| 17 | `debugger` statements left in production code | stepper.service.ts:12, dialog-popup.component.ts:31,48 | Freezes browser when DevTools open |
| 18 | `.Result` used instead of `await` — can cause deadlocks | SurpriseCashVerificationService.cs line 1602 | Server thread pool exhaustion |
| 19 | Captcha validation completely commented out in frontend | [login.component.ts](file:///c:/Users/user/Downloads/UNION%20BANK%20PROJECT/Surprise_Cash_Verification_ui_Angular-dev_angular19/Surprise_Cash_Verification_ui_Angular-dev_angular19/src/app/modules/login/login.component.ts) lines 130-142 | Captcha is shown but never verified client-side |
| 20 | Duplicate AutoMapper registration in Program.cs | Program.cs lines 49, 61-62 | Memory waste, potential mapping conflicts |

### MEDIUM/LOW BUGS

| # | Bug | Location |
|---|-----|----------|
| 21 | `updateEmployee()` uses GET for state mutation | admin.service.ts |
| 22 | `console.log` statements leaking data in production | Multiple files |
| 23 | `FilterPipe` is dead code (not imported anywhere) | filter.pipe.ts |
| 24 | `HomeComponent` is dead code (not routed) | home.component.ts |
| 25 | Unused `ngx-captcha` dependency in package.json | package.json |
| 26 | 4,872-line monolithic component | surprise-cash.component.ts |
| 27 | Excessive `window.location.reload()` instead of state management | Multiple components |
| 28 | `environment.ts` has `production: true` even for dev | environment.ts |
| 29 | Duplicate records in BRANCH_USER_ACCESS seed data | SCV_UAT2.sql |
| 30 | VARCHAR2(20) too small for names/designations | Multiple DB tables |

---

## 8. 🔴 SECURITY VULNERABILITIES

> [!NOTE]
> Items marked **[DEV-ONLY]** are confirmed by the developer to be properly configured in production. Items marked **[BY DESIGN]** are intentional decisions.

### CRITICAL — Immediate Fix Required

| # | Vulnerability | Location | Risk | Status |
|---|--------------|----------|------|--------|
| S1 | **SQL Injection** — 4+ locations with raw SQL string interpolation | UserManagementServices.cs, SurpriseCashVerificationService.cs | Full database compromise | 🔴 ACTIVE in production |
| ~~S2~~ | ~~**Authentication Bypass** — `validate = true` hardcoded~~ | ~~UserManagementServices.cs:239~~ | ~~Anyone can log in~~ | **[DEV-ONLY]** ✅ Not in production |
| S3 | **Hardcoded AES keys in frontend JS** — `01234567890` and `01234567890123456789012345678901` | authentication.service.ts:62,73 | All encrypted data can be decrypted by attackers | 🔴 ACTIVE in production |
| S4 | **Hardcoded AES keys in backend** — Same keys in EncryptoData.cs | EncryptoData.cs:58,94 | Symmetric — frontend and backend use same hardcoded keys | 🔴 ACTIVE in production |
| S5 | **Zero-IV encryption** — `new byte[16]` (all zeros) for AES CBC | EncryptoData.cs:92 | AES-CBC with zero IV is fundamentally insecure | 🔴 ACTIVE in production |
| S6 | **Admin credentials in public config.json** — encrypted but key is hardcoded | assets/config.json | Anyone can download and decrypt admin password | **[BY DESIGN]** ⚠️ |
| S7 | **DB connection string in comments** — `Data Source=172.27.206.146:1525/ORCL19; Password=AAssddff##12345` | login.component.ts:61 | Database credentials exposed in frontend JS | 🔴 ACTIVE in production |
| S8 | **AdminController has NO backend authentication** — APIs callable without token | AdminController.cs | Anyone with API URL can call admin endpoints | **[BY DESIGN]** ⚠️ Frontend password only |
| S9 | **`/annexure` route unprotected** — no AuthGuard | app.routes.ts | Direct URL access bypasses auth | 🔴 ACTIVE in production |

### HIGH — Fix Soon

| # | Vulnerability | Location | Risk |
|---|--------------|----------|------|
| S10 | **Hardcoded API credentials in appsettings.json** — plaintext passwords | appsettings.json | `Software@2021`, API keys, JWT secret all exposed |
| S11 | **SSL certificate validation disabled** — accepts any certificate | SurpriseCashVerificationService.cs:1596 | Man-in-the-middle attacks on Finacle API |
| S12 | **Tokens stored as plaintext in database** — USER_TOKEN.LASTTOKEN | USER_TOKEN table | Token theft if DB is compromised |
| S13 | **No token expiry in database** — tokens persist indefinitely | USER_TOKEN table | Stolen tokens never expire |
| S14 | **Swagger exposed in production** | Program.cs:145 | API documentation visible to attackers |
| S15 | **No rate limiting on login** — brute force possible | AccountController.cs | Account compromise via automated attacks |
| S16 | **No input validation on any DTO** — no `[Required]`, `[MaxLength]` | All Models/ | Malformed data accepted |
| S17 | **Response compression over HTTPS** — `EnableForHttps = true` | Program.cs | BREACH-style compression attacks |
| S18 | **Session IDs generated with non-cryptographic randomness** — `Date.now() % range` | session.service.ts | Predictable session IDs |

### MEDIUM

| # | Vulnerability | Location |
|---|--------------|----------|
| S19 | AuthGuard only checks session key existence, not token validity | auth-guard.service.ts |
| S20 | Interceptor sends empty `Bearer ` for unauthenticated requests | user.interceptor.ts |
| S21 | IP address stored without hashing/anonymization | SURPRISE_CASH_ANNEXURE_2 |
| S22 | SYS_GUID() used for authentication tokens (predictable in Oracle) | SQL DDL |
| S23 | Employee PF numbers and names exposed in SQL seed data | SCV_UAT2.sql, exportFINAL.sql |
| S24 | Sensitive data logged to files | AdminService.cs, UserManagementServices.cs |
| S25 | MyDairy login path auto-validates ALL users without credential check | UserManagementServices.cs:262-265 |

### Summary of Reclassified Items

| Original # | Issue | Original Severity | Updated Status | Reason |
|------------|-------|-------------------|----------------|--------|
| S2 / Bug #1 | `validate = true` AD bypass | 🔴 CRITICAL | ✅ **DEV-ONLY** | Developer confirmed production has proper AD validation |
| Bug #8 | Hardcoded SMS number | 🔴 CRITICAL | ✅ **DEV-ONLY** | Developer confirmed production sends to actual officer's number |
| S8 / Bug #5 | AdminController no `[Authorize]` | 🔴 CRITICAL | ⚠️ **BY DESIGN** | Intentional — only dev + 1 business person use it; frontend has password. Backend APIs remain exposed. |
| S6 | Admin credentials in config.json | 🔴 CRITICAL | ⚠️ **BY DESIGN** | Admin password is encrypted in config.json used only for admin panel access by 2 people |

---

## 9. MISSING ERROR HANDLING

| Area | What's Missing |
|------|---------------|
| **Frontend HTTP calls** | Most API calls in SurpriseCashComponent use empty `error => {}` handlers — errors are silently swallowed |
| **Backend service layer** | Generic `catch(Exception)` blocks return `"Something Went wrong"` — original exception details lost |
| **Database operations** | No retry logic for Oracle connection failures |
| **External API calls** | No timeout configuration on HttpClient calls to AD/Finacle/SMS APIs |
| **File uploads** | No file size/type validation |
| **Concurrent access** | No optimistic concurrency on Annexure updates — last write wins |
| **Token refresh** | No token refresh mechanism — user must re-login after 120 minutes |
| **Network errors** | Frontend has no global error handler for network failures |
| **NULL handling** | Backend services don't consistently check for null entities before operations |

---

## 10. TECHNOLOGY STACK SUMMARY

### Backend
| Component | Technology |
|-----------|------------|
| Framework | .NET 8.0 Web API |
| ORM | Entity Framework Core 8.0 |
| Primary DB | Oracle 19c (via Oracle.EntityFrameworkCore) |
| Secondary DB | SQL Server (via Microsoft.EntityFrameworkCore.SqlServer) |
| Auth | JWT Bearer (Microsoft.AspNetCore.Authentication.JwtBearer) |
| Mapping | AutoMapper 13.0 |
| Logging | Serilog (File sink) |
| Encryption | Custom AES-256 implementation |

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | Angular 19.2 (Standalone Components) |
| UI Library | Angular Material 19.2 |
| CSS Framework | Bootstrap 5.3.6 |
| Encryption | crypto-js 4.2 |
| Excel Export | xlsx 0.18.5 + file-saver 2.0 |
| Notifications | ngx-toastr 19 + SweetAlert2 11.21 |
| Loading | ngx-ui-loader 13 |
| Number-to-Words | to-words 4.5 |

### Infrastructure
| Component | Technology |
|-----------|------------|
| Container | Docker (multi-stage: Angular build + nginx:alpine) |
| Registry | Union Bank Harbor (`harbormz.unionbankofindia.co.in`) |
| Web Server | nginx (for frontend) |
| Deployment | File system publish (D:\Jiger\publish) |

### Environments
| Environment | Frontend URL | API URL |
|-------------|-------------|---------|
| Local Dev | localhost:4200 | localhost:7117/api/ |
| UAT | scvuiuat.unionbankofindia.co.in | uatsw.unionbankofindia.co.in/SCV_API/api/ |
| Production | scvui.unionbankofindia.co.in | app4.unionbankofindia.co.in/scv_backend/api/ |

---

## 11. COMPLETE API ENDPOINT INVENTORY

### AccountController — `api/Account/`
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 1 | GET | GetQuestions | ❌ | Get captcha question |
| 2 | POST | validateDomainUser | ❌ | Login |
| 3 | POST | GetStaffDetailsAfterLogin | ✅ | Get logged-in user details |
| 4 | POST | GetStaffDetails | ✅ | Get any staff details by PF |
| 5 | POST | GetBranchByZoneRegion | ✅ | Get branches for dropdown |
| 6 | POST | GetUnNominatedBranches | ✅ | Get un-nominated branches |
| 7 | POST | GetAnnexureFourUsers | ✅ | Get Annexure-4 users |
| 8 | GET | GetBranchByBrCode | ✅ | Get branch by code |
| 9 | POST | GetBranchDetailsByRegion | ✅ | Get branch employees |
| 10 | GET | LogOut | ❌ | Logout |
| 11 | POST | MyDairyDecrypt | ❌ | SSO decrypt |

### SurpriseCashVerificationController — `api/SurpriseCashVerification/`
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 12 | POST | AddAnnexureOneDetails | ✅ | Create nomination |
| 13 | POST | AddAnnexureTwoDetails | ✅ | Save inspection report |
| 14 | POST | AddAnnexureThreeDetails | ✅ | Add Annexure-3 |
| 15 | POST | AddAnnexureFourDetails | ✅ | Add Annexure-4 |
| 16 | POST | GetAnnexureTwoDetails | ✅ | Get Annexure-2 by userId |
| 17 | POST | GetAnnexureTwoDetailsByPFNo | ✅ | DYRH: Branch SCV report |
| 18 | POST | GetAnnexureTwoDetailsCO | ✅ | CO: Branch SCV report |
| 19 | POST | GetAnnexureTwoDetailsByRegionCode | ✅ | Discrepancies by region |
| 20 | POST | GetAnnexureTwoDetailsByRegionCodeQuater | ✅ | Discrepancies by quarter |
| 21 | POST | GetAnnexureTwoDetailsByZoneCode | ✅ | Discrepancies by zone |
| 22 | POST | GetAnnexureTwoDetailsByCO | ✅ | ZO-Branch SCV report |
| 23 | POST | GetAnnexureTwoDetailsByBranchCode | ✅ | View SCV report |
| 24 | POST | GetAnnexureTwoDetailsByBranchCode1 | ✅ | View SCV by userId |
| 25 | POST | GetAnnexureOneDetails | ✅ | Get Annexure-1 |
| 26 | POST | GetAnnexureOneDetailsByPFno | ✅ | IO nominations |
| 27 | POST | GetAnnexureOneDetailsBySVBranchCode | ✅ | BH Branch SCV report |
| 28 | POST | GetApprovedAnnexureTwoDetails | ✅ | DYRH consolidated report |
| 29 | POST | GetAnnexureThreeDetails | ✅ | Get Annexure-3 |
| 30 | POST | GetAnnexureFiveDetails | ✅ | Get Annexure-5 |
| 31 | POST | GetAnnexureFourDetails | ✅ | Get Annexure-4 |
| 32 | POST | GetApprovedAnnexureFourDetails | ✅ | ZO/CO consolidated report |
| 33 | POST | GetRegionDetails | ✅ | Regions by zone |
| 34 | POST | AddComment | ✅ | Add rejection comment |
| 35 | POST | AddApproved | ✅ | DYRH approve |
| 36 | POST | AddBranchComplied | ✅ | BH compliance |
| 37 | POST | AddROComplied | ✅ | DYRH RO compliance |
| 38 | POST | AddZOComplied | ✅ | ZO compliance |
| 39 | POST | AddCOComplied | ✅ | CO compliance |
| 40 | GET | GetAllAnnexureOneData | ✅ | All Annexure-1 data |
| 41 | GET | DeleteAnnexureOneData | ✅ | Soft-delete Annexure-1 |
| 42 | GET | DeleteAnnexureTwoData | ✅ | Soft-delete Annexure-2 |
| 43 | GET | GetLatestSurpriseDate | ✅ | Latest surprise date |
| 44 | POST | GetDenominationsCashDetails | ✅ | Finacle cash data |
| 45 | GET | GetLogInType | ✅ | Check login type |
| 46 | GET | GetCOLogIn | ✅ | Check CO login |

### AdminController — `api/Admin/` **[BY DESIGN: No backend auth — frontend password only]**
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 47 | GET | GetAllLoginTypes | ❌ (by design) | Paginated employee list |
| 48 | GET | GetEmployeeById/{id} | ❌ (by design) | Get employee |
| 49 | GET | UpdateEmployee/{id} | ❌ (by design) | Update status (GET!) |
| 50 | GET | GetAllStaffTypes | ❌ (by design) | Get roles |
| 51 | GET | GetStaffByEmpId | ❌ (by design) | Get staff by empId |
| 52 | GET | GetAllLoginTypeCount | ❌ (by design) | Count records |
| 53 | POST | AddStaff | ❌ (by design) | Add employee |

**Total: 53 API endpoints** (46 JWT-authenticated, 7 without backend auth [by design — frontend password protected, used by 2 people only])

---

## 12. DEPLOYMENT & ENVIRONMENT CONFIGURATION

### Config Settings (appsettings.json)
| Setting | Purpose | Security |
|---------|---------|----------|
| `ConnectionStrings:DefaultConnection` | Oracle DB connection (encrypted) | Encrypted ✅ |
| `ConnectionStrings:OrganisationsDB` | SQL Server DB connection (encrypted) | Encrypted ✅ |
| `Jwt:Key` | JWT signing key | **Plaintext** ⚠️ |
| `Jwt:Issuer/Audience` | JWT config | Plaintext |
| `M_Service_UserName/Pwd` | AD API credentials | **Plaintext** ⚠️ |
| `API_key` | Finacle API key | **Plaintext** ⚠️ |
| `Admin_UserName/Password` | Admin credentials (encrypted) | Encrypted but key hardcoded |
| `Decryption_key` | AES key for connection strings | **Plaintext** ⚠️ |
| `CORS:Origins` | Allowed frontend origins | Array |

### CORS Origins Configured
```
http://localhost:4200
https://scvuiuat.unionbankofindia.co.in
https://scvuidev.unionbankofindia.co.in
https://scvui.unionbankofindia.co.in
https://scvuiprod.unionbankofindia.co.in
```

---

## READY

I have read and understood **every single file** in this production codebase — all 3 SQL scripts, all 55+ Angular files, all 30+ .NET files, all config files, all environment files, all models, all services, all controllers, all middleware, and all external API integrations.

**Tell me what to fix or build and give me whatever you need.** I will:
- Give you the **exact root cause** of any bug
- Tell you clearly if it's **our code problem** or an **external API problem**
- Provide **complete, ready-to-paste code** — no TODOs, no placeholders
- Specify **exact file, exact function, exact lines** for every change
- If I need more info, I'll ask you **exactly what to run or screenshot**
