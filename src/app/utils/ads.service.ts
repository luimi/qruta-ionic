import { Injectable } from '@angular/core';
import { AdMob, AdOptions, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { isPlatform, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AdvertiseComponent } from '../components/advertise/advertise.component';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  lastInterstitial: number = 0;
  constructor(private utils: UtilsService, private http: HttpClient, private modalCtrl: ModalController) { }

  async getPartnerConfig() {
    const partnerUrl: any = await this.utils.getServerConfig("partner")
    if (!partnerUrl) return null;
    const header: any = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('X-Parse-Application-Id',environment.partner.id);
    if (environment.partner.key) {
      header.append('X-Parse-REST-API-Key', environment.partner.key);
    }
    return { partnerUrl, header };
  }
  async getPartnerAd() {
    const config = await this.getPartnerConfig();
    if (!config) return null;
    const { partnerUrl, header } = config;
    const city = this.utils.getLocal('city');
    const userId = localStorage.getItem(`Parse/${environment.server.appId}/installationId`);
    const request: any = this.http.post(`${partnerUrl}/functions/getCampaign`, {
      code: city.objectId,
      id: userId,
    }, { headers: header });
    let result: any = await lastValueFrom(request).catch(e => null);
    if (result) {
      result = result.result;
      this.utils.gaEvent("ads-partner")
    }
    return result
  }
  async setPartnerAdClick(campaign: string) {
    const config = await this.getPartnerConfig();
    if (!config) return null;
    const { partnerUrl, header } = config;
    const request: any = this.http.post(`${partnerUrl}/functions/clickCampaign`, {
      id: campaign
    }, { headers: header });
    lastValueFrom(request).catch(e => null);
    return
  }

  async initializeAdmob() {
    if (!isPlatform("capacitor") && (!isPlatform("android") || !isPlatform("ios"))) return
    const { status } = await AdMob.trackingAuthorizationStatus();
    if (status === "notDetermined") {
      console.log("notDetermined")
    }
    AdMob.initialize({
      initializeForTesting: !environment.production
    })
    await this.prepareInterstitial();
  }
  async prepareInterstitial() {
    const options: AdOptions = {
      adId: (isPlatform("ios") ? environment.admob.ios : environment.admob.android) || "",
      isTesting: !environment.production,
    }
    await AdMob.prepareInterstitial(options)
  }
  async showInterstitial() {
    try {
      await AdMob.showInterstitial()
      this.utils.gaEvent("ads-admob")
      return true
    } catch (e) {
      return false
    }
  }
  async showAd() {
    let success = false;
    if (isPlatform("capacitor") && (isPlatform("android") || isPlatform("ios"))) {
      success = await this.showInterstitial();
      if (success) await this.prepareInterstitial();
    }
    if (!success) {
      const result: any = await this.getPartnerAd()
      if (result && result.success) {
        const modal = await this.modalCtrl.create({
          component: AdvertiseComponent,
          componentProps: { advertise: result },
        });
        modal.present();
      }
    }
    this.lastInterstitial = new Date().getTime()
  }
  async isReadyForAds() {
    let adTimer = await this.utils.getServerConfig("adTimer") || 30000
    return this.lastInterstitial === 0 || new Date().getTime() - this.lastInterstitial > parseInt(`${adTimer}`)
  }
}
