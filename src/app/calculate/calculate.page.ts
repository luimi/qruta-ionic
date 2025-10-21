import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { GeoService } from '../utils/geo.service';
import { Router } from '@angular/router';
import { UtilsService } from '../utils/utils.service';
import { constants } from '../utils/constants';
import { Map } from 'leaflet';
import { LeafletHelperService } from '../utils/leaflet-helper.service';
import { HistoryService } from '../utils/history.service';
import { HistoryComponent } from './history/history.component';
import Parse from 'parse';
import { ApiService } from '../utils/api.service';
import { CardListComponent } from './card-list/card-list.component';
import { AdsService } from '../utils/ads.service';
import { deprecate } from 'util';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.page.html',
  styleUrls: ['./calculate.page.scss'],
})
export class CalculatePage implements OnInit {

  map: any;
  mapType: any;
  @ViewChild('start') start: any;
  @ViewChild('end') end: any;
  @ViewChild('modalAdvertise') modal: any;
  type = 'urban';
  city: any;
  advertise: any;
  startMarker: any;
  endMarker: any;
  pathLine: any;
  info = { isUpdate: false }
  constructor(
    public actionSheet: ActionSheetController,
    private leaflet: LeafletHelperService,
    private geo: GeoService,
    private router: Router,
    private history: HistoryService,
    private utils: UtilsService,
    public modalCtrl: ModalController,
    private apiCtrl: ApiService,
    private platform: Platform,
    private adCtrl: AdsService
  ) { }

  ngOnInit() { 
    if (!this.advertise) this.showAdvertise();
  }

  ionViewDidEnter() {
    this.city = this.utils.getLocal(constants.keys.city);
    if (this.leaflet.getMap('calculate')) {
      //this.map.invalidateSize()
      this.leaflet.removeMap('calculate')
      //return;
    }
    this.map = this.leaflet.initialize('calculate');
    this.map.on('click', async (event: any) => {
      this.utils.gaEvent("calculate-map-click");
      const ll = event.latlng;
      let location: any = await this.geo.reverse([ll.lat, ll.lng]);
      this.actionSheetAddress(location);
    });
    
    this.utils.getServerConfig("status").then((status: any) => {
      this.info.isUpdate = status.versionCode > (process.env["NG_APP_VERSION"] || 0);
    })
    this.inputChanged("none")
    if(!this.start.location) this.getCurrentPosition()
  }
  ionViewWillLeave() {
    this.leaflet.removeMap('calculate')
  }
  async calculate() {
    if (this.start.location && this.end.location) {
      const walkDistance = this.utils.getLocal(constants.keys.walkDistance);
      const area = walkDistance ? walkDistance : 1;
      const loading = await this.utils.showLoading('calculate.main.calculating');
      const server = await this.apiCtrl.getServer(this.city.objectId)
      if (!server.success) {
        loading.dismiss();
        this.utils.showAlert('calculate.main.errors.highDemand');
        return
      }
      const data = {
        start: this.start.location.location,
        end: this.end.location.location,
        area: area,
        city: this.city.objectId,
        type: this.type
      }
      const result = await this.apiCtrl.calculate(server, data)
      loading.dismiss();
      if (result.success) {
        this.utils.gaEvent("calculate-calculated")
        this.history.add(this.start.location, this.end.location, this.type);
        sessionStorage.setItem('result', JSON.stringify(result));
        this.router.navigate(['/result']);
        this.saveRecent(this.end.location);
        this.saveRecent(this.start.location);
      } else {
        this.utils.showErrorByCode(result.codeError, constants.errors.calculate);
      }
    } else {
      this.utils.showAlert('calculate.main.errors.originOrDestinyMissing');
    }
  }
  private async actionSheetAddress(location: any) {
    const answers: any = await this.utils.getTranslation(["general.origin", "general.destination", "general.cancel", "calculate.input.selected"])
    const actionSheet = await this.actionSheet.create({
      header: location.address === "" ? answers["calculate.input.selected"] : location.address,
      buttons: [{
        text: answers["general.origin"],
        icon: 'location',
        handler: () => {
          this.setAddress(this.start, location);
        }
      }, {
        text: answers["general.destination"],
        icon: 'flag',
        handler: () => {
          this.setAddress(this.end, location);
        }
      }, {
        text: answers["general.cancel"],
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
  saveRecent(location: any) {
    let recents = this.utils.getLocal(constants.local.recents) || [];
    let isRegistered = false;
    recents.forEach((entry: any) => {
      if (entry.address === location.address) {
        isRegistered = true;
      }
    });
    if (!isRegistered) {
      recents.unshift(location);
      if (recents.length > 4) {
        recents.splice(-1, 1);
      }
      this.utils.setLocal(constants.local.recents, recents);
    }

  }
  setAddress(place: any, location: any) {
    place.location = location;
    place.onChanged.emit(place.identifier)
  }
  /**
   * this get user current position and call routes
   */
  async getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((loc) => {
      let coords = loc.coords;
      this.geo.reverse([coords.latitude, coords.longitude]).then((location) => {
        this.setAddress(this.start, location)
      });
    }, () => { }, { enableHighAccuracy: true })
  }

  public async showHistory() {
    this.utils.gaEvent("history-open")
    const modal = await this.modalCtrl.create({
      component: HistoryComponent
    });
    modal.present();
  }

  private async showAdvertise() {
    const result: any = await this.adCtrl.getPartnerAd()
    if(result && result.success) {
      this.advertise = result
      this.modal.present()
    }
  }
  public openAdvertise() {
    window.open(this.advertise.url, '_blank')
    this.adCtrl.setPartnerAdClick(this.advertise.campaign)
  }

  //@deprecate
  private async showPlaceMarks() {
    let city = new Parse.Object("City")
    city.id = this.city.objectId
    let sponsors = await new Parse.Query("Sponsor").equalTo("status", true).equalTo("city", city).select("").find();
    if (sponsors.length === 0) return
    let placemarks = await new Parse.Query("PlaceMark").include("sponsor").containedIn("sponsor", sponsors).find();
    placemarks.forEach((placemark) => {
      let place = {
        address: placemark.get("title"),
        city: this.city.name,
        location: [placemark.get("location").latitude, placemark.get("location").longitude]
      }
      let marker = this.leaflet.addMarker(this.map, place.location, placemark.get("title"), placemark.get("icon"), placemark.get("size"))
      marker.on('click', () => {
        this.actionSheetAddress(place);
      })
    })
  }

  inputChanged(input: string) {
    if (input === "start" && this.startMarker) {
      this.map.removeLayer(this.startMarker)
      delete this.startMarker
    } else if (input === 'end' && this.endMarker) {
      this.map.removeLayer(this.endMarker)
      delete this.endMarker
    }
    if (this.pathLine) {
      this.map.removeLayer(this.pathLine)
    }
    if (this.start.location) {
      this.startMarker = this.leaflet.addMarker(this.map, this.start.location.location, 'Inicio', './assets/origen.png');
    }
    if (this.end.location) {
      this.endMarker = this.leaflet.addMarker(this.map, this.end.location.location, 'Destino', './assets/destino.png');
    }
    if (this.startMarker && this.endMarker) {
      this.pathLine = this.leaflet.addPolyline(this.map, [this.start.location.location, this.end.location.location], "blue")
      this.leaflet.centerMap(this.map, [this.startMarker, this.endMarker])
    }
  }
  openStore() {
    window.open(process.env[this.platform.is("ios") ? "NG_APP_APPSTORE_URL" : "NG_APP_PLAYSTORE_URL"], '_blank');
  }
  async openCardList() {
    const modal = await this.modalCtrl.create({
      component: CardListComponent
    });
    modal.present();
  }
}
