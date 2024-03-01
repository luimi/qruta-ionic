import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeafletHelperService } from '../utils/leaflet-helper.service';
import Parse from 'parse';
import { Location } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { AdsService } from '../utils/ads.service';
import { isPlatform } from '@ionic/angular';

register();
@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {
  map: any;
  route: any;
  images: any[] = [];
  vehicles = [];
  schedule: any = {};
  report: any[] = [];
  constructor(
    private ar: ActivatedRoute,
    private leaflet: LeafletHelperService,
    private location: Location,
    private adsCtrl: AdsService) { }

  ngOnInit() {
    if (isPlatform("android") || isPlatform("ios")) {
      this.adsCtrl.showBanner()
    }
  }

  goBack() {
    this.location.back();
  }

  async ionViewDidEnter() {
    this.map = this.leaflet.initialize('route');
    let id: any = this.ar.snapshot.paramMap.get('routeId')
    if (!id) {
      this.goBack();
      return
    }
    this.route = await new Parse.Query('Route').include('company').get(id || "");
    this.schedule = this.route.get('schedule');
    this.images = await new Parse.Query('Image').equalTo('route', this.route).find();
    let path = this.route.get('path');
    if (path.length > 1) {
      path.forEach((location: any[]) => {
        if (location[2]) {
          const marker = this.leaflet.addMarker(this.map, location, location[2], './assets/stop.png', [40, 45]);
          marker.bindPopup(location[2]);
        }
      });
      const half = Math.ceil(path.length / 2);
      let pl1 = this.leaflet.addPolyline(this.map, path.slice(0, half + 1), 'blue');
      let pl2 = this.leaflet.addPolyline(this.map, path.slice(half, path.length), 'red');
      this.leaflet.centerMap(this.map, [pl1, pl2]);
    }
    let subject = "Actualización de ruta."
    let message = `Hola Q'ruta, esta ruta (${this.route?.get('company')?.get('name')} - ${this.route?.get('name')}), presenta la siguiente actualización: `
    this.report = [{
      icon: 'logo-facebook',
      url: `http://m.me/queruta?text=${message}`
    }, {
      icon: 'logo-twitter',
      url: `https://twitter.com/messages/compose?recipient_id=2575617260&text=${message}`
    }, {
      icon: 'logo-instagram',
      url: `https://ig.me/m/queruta`
    }, {
      icon: 'logo-discord',
      url: 'https://discordapp.com/channels/1187220392260153446/1192299716545888340'
    }, {
      icon: 'mail',
      url: `mailto:queruta@gmail.com?subject=${subject}&body=${message}`
    }
    ]
  }
  ionViewWillLeave() {
    this.leaflet.removeMap('route');
    if (isPlatform("android")) {
      this.adsCtrl.hideBanner();
    }
  }

}
