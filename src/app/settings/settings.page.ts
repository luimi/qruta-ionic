import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { Router } from '@angular/router';
import { LeafletHelperService } from '../utils/leaflet-helper.service';
import { ModalController } from '@ionic/angular';
import { constants } from '../utils/constants';
import { FaqComponent } from './faq/faq.component';
declare var installer: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  selectedDistance: any;
  showFaq: any = false;
  public setup: any;
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
  ) {

  }

  async ngOnInit() {
    const sd = localStorage.getItem(constants.keys.walkDistance);
    this.selectedDistance = sd ? sd : '1';
    this.showFaq = await this.utils.getServerConfig('showFaq');
    this.setup = installer;
  }

  ionViewWillEnter() { }

  backAction() {
    this.location.back();
  }

  onChangeDistance() {
    localStorage.setItem(constants.keys.walkDistance, this.selectedDistance);
  }
  changeCity() {
    localStorage.removeItem(constants.keys.city);
    this.leaflet.removeMap('calculate');
    this.router.navigateByUrl('/cities');
  }
  async faq() {
    const modal = await this.modalCtrl.create({ component: FaqComponent });
    await modal.present();
  }
  install(){
    installer.prompt();
  }
}
