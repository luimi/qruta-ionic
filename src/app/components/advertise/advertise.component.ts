import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdsService } from 'src/app/utils/ads.service';
import { StoryModule } from '../story/story.module';

@Component({
    selector: 'app-advertise',
    templateUrl: './advertise.component.html',
    styleUrls: ['./advertise.component.scss'],
    standalone: false,
})
export class AdvertiseComponent  implements OnInit {
  @Input() advertise: any;

  constructor(private modalCtrl: ModalController, private adCtrl: AdsService) { }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
  public openAdvertise() {
    window.open(this.advertise.url, '_blank')
    this.adCtrl.setPartnerAdClick(this.advertise.campaign)
    this.dismiss()
  }
}
