import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoService } from 'src/app/utils/geo.service';
import { AddressModalComponent } from '../address-modal/address-modal.component';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
})
export class AddressInputComponent implements OnInit {
  @Input() title: string = "";
  @Input() hint: string = "";
  @Input() currentLocation: boolean = false;
  @Input() identifier: string = "";
  @Output() onChanged =  new EventEmitter<string>()
  public location: any;
  isLoading = false;
  constructor(public modalCtrl: ModalController, private geo: GeoService, private utils: UtilsService) { }

  ngOnInit() { }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddressModalComponent
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      this.location = result.data;
      this.onChanged.emit(this.identifier)
    }
  }
  clear() {
    this.location = undefined;
    this.onChanged.emit(this.identifier)
  }
  getCurrentLocation() {
    this.isLoading = true;
    this.utils.gaEvent("calculate-current-location")
    navigator.geolocation.getCurrentPosition(async (loc) => {
      const location = [loc.coords.latitude, loc.coords.longitude];
      this.location = await this.geo.reverse(location);
      this.isLoading = false;
      this.onChanged.emit(this.identifier)
    }, ()=> {
      this.isLoading = false;
    },{ enableHighAccuracy: true });
  }

}
