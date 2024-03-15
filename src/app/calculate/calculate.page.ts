import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
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
  addressToggle = false;
  hiddenToggle = true;
  type = 'urban';
  city: any;
  advertise: any;
  constructor(
    public actionSheet: ActionSheetController,
    private leaflet: LeafletHelperService,
    private geo: GeoService,
    private router: Router,
    private history: HistoryService,
    private utils: UtilsService,
    public modalCtrl: ModalController,
    private apiCtrl: ApiService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.city = this.utils.getLocal(constants.keys.city);
    if (this.leaflet.getMap('calculate')) {
      //this.map.invalidateSize()
      this.leaflet.removeMap('calculate')
      //return;
    }
    this.map = this.leaflet.initialize('calculate');
    this.map.on('click', async (event: any) => {
      if (this.addressToggle) {
        this.closeAddressField();
      } else {
        const ll = event.latlng;
        let location: any = await this.geo.reverse([ll.lat, ll.lng]);
        this.actionSheetAddress(location);
      }
    });
    this.map.on('movestart', async () => {
      this.closeAddressField();
    });
    this.showPlaceMarks();
    if (!this.advertise) this.showAdvertise();
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
    const answers: any = await this.utils.getTranslation(["general.origin", "general.destination", "general.cancel"])
    const actionSheet = await this.actionSheet.create({
      header: location.address,
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
    if (!this.addressToggle) {
      this.addressToggle = true;
      this.hiddenToggle = false;
    }
  }
  /**
   * this get user current position and call routes
   */
  async getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((loc) => {
      let coords = loc.coords;
      this.geo.reverse([coords.latitude, coords.longitude]).then((location) => {
        this.start.location = location;
      });
    }, () => { }, { enableHighAccuracy: true })
  }

  /**
   * close address fields if is open
   */
  private closeAddressField() {
    if (this.addressToggle) {
      this.addressToggle = false;
      setTimeout(() => {
        this.hiddenToggle = true;
      }, 1000);
    }
  }

  public async showHistory() {
    const modal = await this.modalCtrl.create({
      component: HistoryComponent
    });
    modal.present();
  }

  private async showAdvertise() {
    let city = new Parse.Object("City")
    city.id = this.city.objectId
    let sponsors = await new Parse.Query("Sponsor").equalTo("status", true).equalTo("city", city).select("").find();
    if (sponsors.length === 0) return
    let adQuery = new Parse.Query("Advertise").include("sponsor").containedIn("sponsor", sponsors)
    let count = await adQuery.count();
    if (count === 0) return
    this.advertise = await adQuery.skip(Math.floor(Math.random() * count)).first()
    this.modal.present()
  }
  public openAdvertise(url: string) {
    window.open(url, '_blank')
  }

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
}
