import { Injectable } from '@angular/core';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  constructor() { }

  async initializeAdmob() {
    const {status} = await AdMob.trackingAuthorizationStatus();
    if(status === "notDetermined") {
      console.log("notDetermined")
    }
    AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: !environment.production
    })
  }
  async prepareInterstitial() {
    const options: AdOptions = {
      adId: process.env["NG_APP_ANDROID_ADMOB_INTERSTITIAL"] || "",
      isTesting: !environment.production,
    }
    await AdMob.prepareInterstitial(options)
  }
  async showInterstitial() {
    await AdMob.showInterstitial()
  }
  async showBanner() {
    const options: BannerAdOptions = {
      adId: process.env["NG_APP_ANDROID_ADMOB_BANNER"] || "",
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 57,
      isTesting: !environment.production,
      //npa: true
    }
    await AdMob.showBanner(options).catch(e => console.log(e))
  }
  async hideBanner() {
    await AdMob.removeBanner()
  }
}
