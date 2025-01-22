import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { UtilsService } from './utils/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private translateCtrl: TranslateService,
    private utils: UtilsService
  ) {
    this.platform.ready().then(async () => {
      let currentLang = this.translateCtrl.getBrowserLang()
      moment.locale(currentLang)
      this.utils.gaEvent(`lang-${currentLang}`)
      // español, ingles, frances, aleman, portugues, italiano, chino, polaco, netherlandes
      let currentLangs = ["es", "en", "fr", "de", "pt", "it", "zh", "pl", "nl"]
      translateCtrl.use(currentLang && currentLangs.includes(currentLang) ? currentLang : "en")
      let _platform = "" 
      const getOS = () => {
        return this.platform.is("ios") ? "ios" : this.platform.is("android") ? "android" : "web"
      }
      if(this.platform.is("desktop")) {
        _platform = "web-desktop"
      } else if(this.platform.is("pwa")) {
        _platform = `pwa-${getOS()}`
      } else if(this.platform.is("capacitor")) {
        _platform = `native-${getOS()}`
      } else if(this.platform.is("mobileweb")) {
        _platform = `web-${getOS()}`
      }
      if (this.platform.is("capacitor")) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#011f35' });
      }
      this.utils.gaEvent(`platform-${_platform}`)
      this.utils.gaEvent(`version-${process.env["NG_APP_VERSION"] || 0}`)
      this.platform.backButton.subscribeWithPriority(9999, () => { })
    });
  }
}
