import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { Router } from '@angular/router';
import { constants } from '../utils/constants';
import {SplashScreen} from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  private splashStatus = false
  private appStatus = false
  private next : string = ""

  constructor(private utils: UtilsService, private router: Router) { }

  async ngOnInit() {
    SplashScreen.hide();
    setTimeout(() => {
      this.splashStatus = true
      this.continueProcess()
    }, 5000);
    if(await this.checkNewVersion()) this.next = "update"
    else if(await this.checkMaintenance()) this.next = "maintenance"
    else if(this.checkSelectedCity()) this.next = "main/calculate"
    else this.next = "cities"
    this.appStatus = true
    this.continueProcess()
    // TODO borrar historial?

  }

  async checkNewVersion(){
    //TODO verificar version
    /*try {

      const versionCode = await this.appVersion.getVersionCode();
      if (versionCode) {
        const status: any = await this.utils.getServerConfig('status');
        const serverVersionCode = status.versionCode;
        if (serverVersionCode > versionCode) {
          this.utils.showAlert('¡Hay una nueva versión de Q´ruta! Búscala en la tienda y actualízala');
          return;
        }
      }
    } catch (e) { }*/
    return false
  }
  async checkMaintenance(){
    return await this.utils.getServerConfig('maintenance');
  }

  checkSelectedCity(){
    return localStorage.getItem(constants.keys.city)
  }

  continueProcess(){
    if(!this.splashStatus || !this.appStatus || this.next === "") return
    this.router.navigate([this.next])
  }
}
