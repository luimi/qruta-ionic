import { Component } from '@angular/core';

import { IonTabs, isPlatform } from '@ionic/angular';
import { AdsService } from '../utils/ads.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../utils/utils.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: false
})
export class TabsPage {
  private activeTab?: HTMLElement;
  showNews: boolean = false;
  constructor(private adsCtrl: AdsService, private utils: UtilsService) {
    this.adsCtrl.initializeAdmob()
    this.getTabConfig()
  }
  async getTabConfig() {
    let result = await this.utils.getServerConfig("showNews")
    if(result) this.showNews = result as boolean
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
