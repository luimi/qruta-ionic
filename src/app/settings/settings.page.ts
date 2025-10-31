import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { Router } from '@angular/router';
import { LeafletHelperService } from '../utils/leaflet-helper.service';
import { ModalController, Platform } from '@ionic/angular';
import { constants } from '../utils/constants';
import { FaqComponent } from './faq/faq.component';
import Parse from 'parse';
import { environment } from 'src/environments/environment';
import { SocialLogin } from '@capgo/capacitor-social-login';
declare var installer: any;

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
    standalone: false
})
export class SettingsPage implements OnInit {

  selectedDistance: any;
  selectedLayer: any;
  layers: any[] = [];
  sponsors: any[] = [];
  public setup: any;
  version: string = `${environment.version}`;
  social = [{
    icon: 'logo-facebook',
    url: 'https://www.facebook.com/queruta'
  }, {
    icon: 'logo-twitter',
    url: 'https://twitter.com/QRuta1'
  }, {
    icon: 'logo-instagram',
    url: 'https://www.instagram.com/queruta/'
  }, {
    icon: 'logo-discord',
    url: 'https://discord.gg/u5qCXUTkQx'
  }];
  constructor(
    private location: Location,
    public utils: UtilsService,
    private router: Router,
    private leaflet: LeafletHelperService,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.initSocials();
    console.log("settings")
  }

  async ngOnInit() {
    this.layers = this.leaflet.getLayers();
    const sd = localStorage.getItem(constants.keys.walkDistance);
    this.selectedDistance = sd ? sd : '1';
    const sl = localStorage.getItem(constants.keys.layer);
    this.setup = installer;
    this.selectedLayer = sl ? sl : '0';
    this.sponsors = await new Parse.Query("Sponsor").equalTo("status", true).exists("icon").find()
  }

  ionViewWillEnter() { }

  backAction() {
    this.location.back();
  }

  onChangeDistance() {
    localStorage.setItem(constants.keys.walkDistance, this.selectedDistance);
  }
  onChangeLayer() {
    localStorage.setItem(constants.keys.layer, this.selectedLayer);
    this.leaflet.setLayer('calculate', this.selectedLayer);
  }
  changeCity() {
    localStorage.removeItem(constants.keys.city);
    this.leaflet.removeMap('calculate');
    this.router.navigateByUrl('/cities');
  }
  async faq() {
    this.utils.gaEvent("settings-faq")
    const modal = await this.modalCtrl.create({ component: FaqComponent });
    await modal.present();
  }
  install() {
    installer.prompt();
  }

  openTerms() {
    this.utils.gaEvent("settings-terms")
  }

  mask() {
    return `${this.version.substring(0,1)}.${this.version.substring(1,2)}.${this.version.substring(2,this.version.length)}`
    //if(!this.version && this.version !== null) return ""
    //let v = "123124"
    //let groups = v.split('').reverse().join('').match(/\d{1,3}/g).reverse();
    //return '#' + groups.join('.');
  }

  async initSocials() {
    const methods: any = {
      google: {
        webClientId: environment.social.google.web,
        iOSClientId: environment.social.google.ios,
        //iOSServerClientId: 'YOUR_WEB_CLIENT_ID',
        mode: 'online',
      }
    }
    if(this.utils.isIOS()) {
      methods['apple'] = {}
    }
    await SocialLogin.initialize(methods);
  }
}
