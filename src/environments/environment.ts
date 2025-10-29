// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 1,
  server: {
    loadBalancer: 'https://loadbalancer.domain.com',
    url: 'https://domain.com/parse',
    appId: 'abcdefghijklmnopqrstuvwxyz1234567890'
  },
  admob: {
    android: 'ca-app-pub-1234567890/1234567890',
    ios: 'ca-app-pub-1234567890/1234567890'
  },
  store: {
    android: 'https://play.google.com/store/apps/details?id=com.package',
    ios: 'https://apps.apple.com/co/app/qruta/id'
  },
  partner: {
    id: 'abcdefghijklmnopqrstuvwxyz1234567890',
    key: 'abcdefghijklmnopqrstuvwxyz1234567890',
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
