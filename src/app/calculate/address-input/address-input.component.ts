import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoService } from 'src/app/utils/geo.service';
import { AddressModalComponent } from '../address-modal/address-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
})
export class AddressInputComponent implements OnInit {
  @Input() title: string = "";
  @Input() hint: string = "";
  @Input() currentLocation: boolean = false;
  public location: any;
  isLoading = false;
  locationSelectedText = "";
  constructor(public modalCtrl: ModalController, private geo: GeoService, private translateCtrl: TranslateService) { }

  ngOnInit() { 
    this.translateCtrl.get("calculate.input.selected").subscribe(res => this.locationSelectedText = res)
  }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddressModalComponent
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      this.location = result.data;
    }
  }
  clear() {
    this.location = undefined;
  }
  getCurrentLocation() {
    this.isLoading = true;
    navigator.geolocation.getCurrentPosition(async (loc) => {
      const location = [loc.coords.latitude, loc.coords.longitude];
      this.location = await this.geo.reverse(location);
      this.isLoading = false;
    }, ()=> {
      this.isLoading = false;
    },{ enableHighAccuracy: true });
  }

}
