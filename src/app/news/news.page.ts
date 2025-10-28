import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import Parse from 'parse';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { TabPage } from '../tab/tab.page';

@Component({
    selector: 'app-news',
    templateUrl: './news.page.html',
    styleUrls: ['./news.page.scss'],
    standalone: false
})
export class NewsPage extends TabPage implements OnInit {

  sources: any = []
  data: any = {}
  info: any = []
  selected: string = ""

  constructor(public override utils: UtilsService, private http: HttpClient) {
    super(utils)
  }

  async ionViewDidEnter() {
    if(this.isSameCity() && !this.isTimePassed(30)) return
    else {
      this.sources = []
      this.info = []
      this.data = {}
      this.setEmptyState({text: "news.loading", icon: "newspaper", progress: true})
    }
    const current = this.utils.getLocal('city');
    this.sources = await new Parse.Query("NewsSource").equalTo("city", this.utils.getGenericObject("City", current.objectId)).find()
    if (this.sources.length === 0) {
      this.setEmptyStateText("news.noNews")
    } else {
      this.selected = this.sources[0].get("type")
      await this.loadInfo()
    }
    this.hideEmptyStateProgress()
    this.renewCurrentTime()
  }
  async loadInfo() {
    if(this.data[this.selected]) {
      this.info = this.data[this.selected]
      return
    }
    this.info = []
    this.setEmptyState({progress: true, icon: "logo-twitter", text: "news.twitter.loading"})
    const index = this.sources.map((o: any) => o.get("type")).indexOf(this.selected)
    try {
      this.info = await this.getData(this.sources[index].get("url"))
      this.data[this.selected] = this.info
    } catch (e) { }
    if (this.info.length === 0) {
      this.setEmptyStateText("news.twitter.noTweets")
    }
    this.hideEmptyStateProgress()
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
  getTime(date: string) {
    return moment(date, "ddd MMM DD HH:mm:ss Z YYYY", "en").locale(this.utils.currentLocale).fromNow()
  }
}
