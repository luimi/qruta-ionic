import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private translateCtrl: TranslateService
  ) {
    this.platform.ready().then(async () => {
      let currentLang = this.translateCtrl.getBrowserLang()
      moment.locale(currentLang)
      // español, ingles, frances, aleman, portugues, italiano, chino, polaco, netherlandes
      let currentLangs = ["es","en","fr","de","pt","it","zh","pl","nl"]
      translateCtrl.use(currentLang && currentLangs.includes(currentLang) ? currentLang : "en")
      let android = this.platform.is("android")
      let ios = this.platform.is("ios")
      let capacitor = this.platform.is("capacitor")
      if ((android || ios) && capacitor) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#011f35' });
      }
      this.platform.backButton.subscribeWithPriority(9999, () => { })
    });
  }
}
