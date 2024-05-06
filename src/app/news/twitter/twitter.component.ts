import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
declare var twttr: any;

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss'],
})
export class TwitterComponent implements OnInit {
  source: any;
  constructor(public modalCtrl: ModalController, private navParams: NavParams) { }
  //https://developer.twitter.com/en/docs/twitter-for-websites/timelines/overview
  ngOnInit() {
    this.source = this.navParams.get("source")
    twttr.ready(() => {
      twttr.widgets.load();
    });
  }

}
