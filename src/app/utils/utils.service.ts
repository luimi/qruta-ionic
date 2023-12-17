import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import Parse from 'parse';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private config: any;
  public appId = '7S389pHCOfe0ZRH7Dd3598YOpOr9AaJ63r9VdV49';
  public setup: any;
  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private platform: Platform, private http: HttpClient) {

  }
  public async showConfirmDialog(message: string, callback: any) {
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Si',
          handler: callback
        }
      ]
    });

    await alert.present();
    return alert;
  }

  public async showAlert(message: string, okCallBack?: any) {
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: 'Ok',
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
    const loading = await this.loadingCtrl.create({
      message: text
    });
    await loading.present();
    return loading;
  }
  public getLocal(key: string) {
    if(localStorage.getItem(key)) return JSON.parse(localStorage.getItem(key) || "{}");
    else return undefined
  }
  public setLocal(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  public getSess(key: string) {
    if(sessionStorage.getItem(key)) return JSON.parse(sessionStorage.getItem(key) || "{}");
    else return undefined
  }
  public setSess(key: string, obj: any) {
    sessionStorage.setItem(key, JSON.stringify(obj));
  }
  public showErrorByCode(code: number, messages: string[]) {
    this.showAlert(messages[code - 1]);
  }
  public async getServer() {
    const loadBalancer = process.env["NG_APP_LOADBALANCER_URL"];
    let server = process.env["NG_APP_SERVER_URL"];
    if (loadBalancer)
      try {
        let response: any = await lastValueFrom(this.http.get(loadBalancer))
        server = response.server
      } catch (e) { }
    return server;
  }

  public getInstallationId() {
    return localStorage.getItem(`Parse/${this.appId}/installationId`);
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
}
