// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  isProductionBuild: true,
  //apiBaseUrl: 'http://localhost:7117/api/',
  apiBaseUrl: 'https://app4.unionbankofindia.co.in/scv_backend/api/',
  //apiBaseUrl: 'https://uatsw.unionbankofindia.co.in/surprise_api/api/',

  config: {
    appName: 'bank-visit',
    //baseUrl: 'http://localhost:7117/api/',
    //baseUrl: 'https://uatsw.unionbankofindia.co.in/surprise_api/api/',
    baseUrl: 'https://app4.unionbankofindia.co.in/scv_backend/api/',
    apiVersion: '',
    sessionIdleTime: 240, //seconds
    sessionTimeout: 60, //seconds
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
