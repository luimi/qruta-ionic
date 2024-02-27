import { Component } from '@angular/core';

import { IonTabs, isPlatform } from '@ionic/angular';
import { AdsService } from '../utils/ads.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  private activeTab?: HTMLElement;
  constructor(private adsCtrl: AdsService) {
    if(isPlatform("android") || isPlatform("ios")) {
      this.admob()
    }
  }
  async admob() {
    await this.adsCtrl.initializeAdmob()
    await this.adsCtrl.prepareInterstitial()
  }
  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView?.element;
  }
  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }
  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }
  private propagateToActiveTab(eventName: string) {    
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }
}
