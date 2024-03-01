import { Injectable } from '@angular/core';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { isPlatform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  lastInterstitial: number = 0;
  constructor() { }

  async initializeAdmob() {
    const { status } = await AdMob.trackingAuthorizationStatus();
    if (status === "notDetermined") {
      console.log("notDetermined")
    }
    AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: !environment.production
    })
  }
  async prepareInterstitial() {
    const options: AdOptions = {
      adId: (isPlatform("android") ? process.env["NG_APP_ANDROID_ADMOB_INTERSTITIAL"] : process.env["NG_APP_IOS_ADMOB_INTERSTITIAL"]) || "",
      isTesting: !environment.production,
    }
    await AdMob.prepareInterstitial(options)
  }
  async showInterstitial() {
    await AdMob.showInterstitial()
    this.lastInterstitial = new Date().getTime()
  }
  isReadyForAds() {
    return this.lastInterstitial === 0 || new Date().getTime() - this.lastInterstitial > 30 * 1000
  }
  async showBanner() {
    const options: BannerAdOptions = {
      adId: (isPlatform("android") ? process.env["NG_APP_ANDROID_ADMOB_BANNER"] : process.env["NG_APP_IOS_ADMOB_BANNER"]) || "",
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
