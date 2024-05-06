import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import Parse from 'parse';
import { ModalController } from '@ionic/angular';
import { TwitterComponent } from './twitter/twitter.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  sources: any[] = [];
  @ViewChild('emptyState') emptyState: any;

  constructor(private utils: UtilsService, private modalCtrl: ModalController) { }

  ngOnInit() {

  }
  async ionViewDidEnter() {
    if (this.emptyState) this.emptyState.showProgress();
    const currentCity = this.utils.getLocal('city');
    const City = Parse.Object.extend("City");
    const city = new City();
    city.id = currentCity.objectId;
    this.sources = await new Parse.Query("NewsSource").equalTo("city", city).equalTo("status", true).ascending("order").find()
    if (this.sources.length === 0) {
      if (this.emptyState) this.emptyState.setText(await this.utils.getTranslation("news.noNews"))
    }
    if (this.emptyState) this.emptyState.hideProgress();
  }

  async openSource(source: any) {
    const modal = await this.modalCtrl.create({
      component: TwitterComponent,
      componentProps: { source }
    });
    modal.present();
  }
}
