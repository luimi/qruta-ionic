import { Component, OnInit } from '@angular/core';
import { LeafletHelperService } from 'src/app/utils/leaflet-helper.service';
import { GeoService } from 'src/app/utils/geo.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-address-map',
  templateUrl: './address-map.component.html',
  styleUrls: ['./address-map.component.scss'],
})
export class AddressMapComponent implements OnInit {
  map:any;
  constructor(private leaflet: LeafletHelperService,private geo:GeoService, public modalCtrl: ModalController) { }

  ngOnInit() {
    setTimeout(()=>{
      this.init();
    },1000);
  }
  init(){
    this.map = this.leaflet.initialize('address');
  }
  ionViewWillLeave(){
    this.leaflet.removeMap('address');
  }
  async select(){
    let location = this.map.getBounds().getCenter();
    location = await this.geo.reverse([location.lat,location.lng]);
    this.modalCtrl.dismiss(location);
  }
}
