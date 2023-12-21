import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform
    ) {
    this.platform.ready().then(async () => {
      if(!this.platform.is("desktop")) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({color:'#011f35'});
      }
      this.platform.backButton.subscribeWithPriority(9999, () => { })
    });
  }
}
