export const environment = {
  production: true,
  isProductionBuild: true,

  // apiBaseUrl: 'https://localhost:7117/api/',//UAT
  apiBaseUrl: 'https://uatsw.unionbankofindia.co.in/SCV_API/api/',//UAT
  //apiBaseUrl: 'https://app4.unionbankofindia.co.in/scv_backend/api/',
  config: {
    appName: 'bank-visit',
    //baseUrl: 'https://localhost:7117/api/',//UAT
    baseUrl: 'https://uatsw.unionbankofindia.co.in/SCV_API/api/', // UAT
    //baseUrl: 'https://app4.unionbankofindia.co.in/scv_backend/api/',
    apiVersion: '',
    sessionIdleTime: 240, //seconds
    sessionTimeout: 60, //seconds
  }
};
