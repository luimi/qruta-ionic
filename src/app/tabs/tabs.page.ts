import { Component } from '@angular/core';

import { isPlatform } from '@ionic/angular';
import { AdsService } from '../utils/ads.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private adsCtrl: AdsService) {
    if(isPlatform("android")) {
      this.admob()
    }
  }
  async admob() {
    await this.adsCtrl.initializeAdmob()
    await this.adsCtrl.prepareInterstitial()
  }
  
}
