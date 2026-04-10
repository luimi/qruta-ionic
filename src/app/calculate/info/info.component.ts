import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import { constants } from 'src/app/utils/constants';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  standalone: false
})
export class InfoComponent  implements OnInit {
  city: any;
  count = 0;
  constructor(public modalCtrl: ModalController, private utils: UtilsService) { }

  async ngOnInit() {
    await this.getCity();
    this.getRoutesCount();
  }
  async getCity() {
    const _city = this.utils.getLocal(constants.keys.city);
    this.city = this.utils.getGenericObject("City", _city.objectId)
    await this.city.fetch();
  }
  async getRoutesCount() {
    this.count = await new Parse.Query("Route").equalTo("city", this.city).equalTo("status", true).count()
  }

  moreInfo() {
    window.open(this.city.get("infoLink"), '_blank');
    this.utils.gaEvent("information-more");
  }

}
