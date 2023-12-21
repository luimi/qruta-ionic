import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { AdsService } from '../utils/ads.service';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
// https://github.com/ratson/cordova-plugin-admob-free
// https://ionicframework.com/docs/native/admob-free
export class ResultPage implements OnInit {
  options: any;
  constructor(private router: Router, private location: Location, private utils: UtilsService, private adsCtrl: AdsService) { }

  async ngOnInit() {
    this.options = JSON.parse(sessionStorage.getItem('result') || "[]").options;
    //this.router.navigateByUrl('/ads');
    this.showAd()
  }

  async showAd() {
    if(isPlatform("android")) {
      await this.adsCtrl.showInterstitial();
      await this.adsCtrl.prepareInterstitial();
    }
    
  }
  openDetails(index: number) {
    this.router.navigate(['/result-details',index]);
  }
  goBack() {
    this.location.back();
  }

}
