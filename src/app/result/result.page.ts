import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { AdsService } from '../utils/ads.service';
import { ModalController, isPlatform } from '@ionic/angular';
import { AdsComponent } from './ads/ads.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
// https://github.com/ratson/cordova-plugin-admob-free
// https://ionicframework.com/docs/native/admob-free
export class ResultPage implements OnInit {
  options: any;
  view: string = "list";
  gridSizes: number[] = [12,6,4]
  constructor(private router: Router, private location: Location, private utils: UtilsService, private adsCtrl: AdsService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.options = JSON.parse(sessionStorage.getItem('result') || "[]").options;
    //this.router.navigateByUrl('/ads');
    this.showAd()
  }

  async showAd() {
    if (isPlatform("android") || isPlatform("ios")) {
      await this.adsCtrl.showInterstitial();
      await this.adsCtrl.prepareInterstitial();
    } else {
      /*const modal = await this.modalCtrl.create({
        component: AdsComponent
      });
      modal.present();*/
    }

  }
  openDetails(index: number) {
    this.router.navigate(['/result-details', index]);
  }
  goBack() {
    this.location.back();
  }
}
