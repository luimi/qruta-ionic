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
  addressToggle = false;
  hiddenToggle = true;
  type = 'urban';
  city: any;
  constructor(
    public actionSheet: ActionSheetController,
    private leaflet: LeafletHelperService,
    private geo: GeoService,
    private router: Router,
    private history: HistoryService,
    private utils: UtilsService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {}

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
        const actionSheet = await this.actionSheet.create({
          header: location.address,
          buttons: [{
            text: 'Origen',
            icon: 'location',
            handler: () => {
              this.setAddress(this.start, location);
            }
          }, {
            text: 'Destino',
            icon: 'flag',
            handler: () => {
              this.setAddress(this.end, location);
            }
          }, {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel'
          }]
        });
        await actionSheet.present();
      }

    });
    this.map.on('movestart', async () => {
      this.closeAddressField();
    });
  }
  ionViewWillLeave() {
    this.leaflet.removeMap('calculate')
  }
  async calculate() {
    if (this.start.location && this.end.location) {
      const walkDistance = this.utils.getLocal(constants.keys.walkDistance);
      const area = walkDistance ? walkDistance : 1;
      const loading = await this.utils.showLoading('Buscando Rutas');
      const result = await Parse.Cloud.run("calculate", {
        start: this.start.location.location,
        end: this.end.location.location,
        area: area,
        city: this.city.objectId,
        type: this.type
      });
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
      this.utils.showAlert('Por favor escoja una direccion de origen y una de destino');
    }
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


}
