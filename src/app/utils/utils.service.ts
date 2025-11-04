import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import Parse from 'parse';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { constants } from './constants';
declare let gtag: any;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private config: any;
  public setup: any;
  public currentLocale: string = "en";
  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private platform: Platform, private http: HttpClient, private translateCtrl: TranslateService) {

  }
  public async showConfirmDialog(message: string, callback: any) {
    const answers: any = await this.getTranslation(["general.yes", "general.no"])
    const _message: any = await this.getTranslation(message)
    const alert = await this.alertCtrl.create({
      message: _message,
      buttons: [
        {
          text: answers["general.no"],
          role: 'cancel',
          cssClass: 'main'
        },
        {
          text: answers["general.yes"],
          handler: callback
        }
      ]
    });

    await alert.present();
    return alert;
  }

  public async showAlert(text: string, okCallBack?: any) {
    if(!text) return
    const answer: any = await this.getTranslation("general.ok")
    const message: any = await this.getTranslation(text)
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: answer,
          handler: () => {
            if (okCallBack) {
              okCallBack();
            }
          }
        }
      ]
    });

    await alert.present();
    return alert;
  }

  public async showLoading(text: string) {
    const message: any = await this.getTranslation(text)
    const loading = await this.loadingCtrl.create({
      message: message
    });
    await loading.present();
    return loading;
  }
  public getLocal(key: string) {
    if (localStorage.getItem(key)) return JSON.parse(localStorage.getItem(key) || "{}");
    else return undefined
  }
  public setLocal(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  public getSess(key: string) {
    if (sessionStorage.getItem(key)) return JSON.parse(sessionStorage.getItem(key) || "{}");
    else return undefined
  }
  public setSess(key: string, obj: any) {
    sessionStorage.setItem(key, JSON.stringify(obj));
  }
  public showErrorByCode(code: number, messages: string[]) {
    this.showAlert(messages[code - 1]);
  }
  public async getServer() {
    const loadBalancer = environment.server.loadBalancer;
    let server = environment.server.url;
    if (loadBalancer)
      try {
        let response: any = await lastValueFrom(this.http.get(loadBalancer))
        server = response.server
      } catch (e) { }
    return server;
  }

  public getInstallationId() {
    return localStorage.getItem(`Parse/${environment.server.appId}/installationId`);
  }
  public getServerConfig(param: string) {
    return new Promise(async (result, reject) => {
      const getConfig = async () => {
        try {
          this.config = await Parse.Config.get();
          clearInterval(interval);
          result(this.config.get(param));
        } catch (e) {
          if (Parse.User.current()) {
            await Parse.User.logOut();
          }
        }
      }
      const interval = setInterval(() => {
        getConfig();
      }, 60000);
      if (this.config) {
        result(this.config.get(param));
        clearInterval(interval);
      } else {
        getConfig();
      }

    });
  }
  public getTranslation(key: string | string[]) {
    return new Promise((res, rej) => {
      this.translateCtrl.get(key).subscribe(result => res(result))
    })
  }
  public gaEvent(name: string) {
    if(environment.production) gtag('event', name, {});
  }
  public getGenericObject(_class: string, id?: string) {
    let generic = new Parse.Object(_class);
    if(id) generic.id = id
    return generic
  }

  public isIOS(){
    return this.platform.is('ios') && this.platform.is('capacitor')
  }
}
