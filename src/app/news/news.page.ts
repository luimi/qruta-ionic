import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  sources: any = [];
  info: any = []
  @ViewChild('emptyState') emptyState: any;

  constructor(private utils: UtilsService, private http: HttpClient) { }

  ngOnInit() {

  }
  async ionViewDidEnter() {
    if (this.emptyState) this.emptyState.showProgress();
    const current = this.utils.getLocal('city');
    const city = await new Parse.Query("City").get(current.objectId)
    this.sources = city.get("news")
    if (this.sources.length === 0) {
      if (this.emptyState) this.emptyState.setText(await this.utils.getTranslation("news.noNews"))
    } else {
      await this.loadInfo({ detail: { value: this.sources[0].title } })
    }
    if (this.emptyState) this.emptyState.hideProgress();
  }
  async loadInfo(evt: any) {
    this.info = []
    if (this.emptyState) {
      this.emptyState.showProgress();
      this.emptyState.setText(await this.utils.getTranslation("news.twitter.loading"))
    }
    const index = this.sources.map((o: any) => o.title).indexOf(evt.detail.value)
    try {
      this.info = await this.getData(this.sources[index].source)
    } catch(e){}
    if(this.info.length === 0) {
      if (this.emptyState) this.emptyState.setText(await this.utils.getTranslation("news.twitter.noTweets"))
    }
    if (this.emptyState) this.emptyState.hideProgress();
  }

  private getData(url: string) {
    return new Promise((res, rej) => {
      this.http.get(url).subscribe((data) => {
        res(data)
      }, (e) => {
        rej(e)
      })
    })
  }
  getTime(date: string){
    return moment(date, "ddd MMM DD HH:mm:ss Z YYYY").fromNow()
  }
}
