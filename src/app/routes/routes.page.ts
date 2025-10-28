import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { UtilsService } from '../utils/utils.service';
import { TabPage } from '../tab/tab.page';
import { FavoriteService } from '../utils/favorite.service';
@Component({
    selector: 'app-routes',
    templateUrl: './routes.page.html',
    styleUrls: ['./routes.page.scss'],
    standalone: false
})
export class RoutesPage extends TabPage implements OnInit {
  companies: any = {};
  filtered: any = {};
  days = 4 * 24 * 60 * 60 * 1000;
  objectKeys = Object.keys;
  selectedBtn: "favorites" | "all" = "all";
  
  constructor(public override utils: UtilsService, public favoriteCtrl: FavoriteService) { 
    super(utils)
  }
  async ionViewDidEnter() {
    if(this.isSameCity()) return
    else  this.companies = {};
    this.showEmptyStateProgress()
    let routes = await new Parse.Query('Route').equalTo('city', this.utils.getGenericObject("City", this.currentCity.objectId)).equalTo('status', true).select('name', 'company', 'details').include('company').ascending('name').limit(1000).find();
    routes.sort((a, b) => {
      if (a.get('company').get('name') < b.get('company').get('name'))
        return -1;
      if (a.get('company').get('name') > b.get('company').get('name'))
        return 1;
      return 0;
    });
    routes.forEach((route) => {
      let companyId = route.get('company').id;
      if (!this.companies[companyId]) {
        this.companies[companyId] = {
          name: route.get('company').get('name'),
          routes: [],
        };
      }
      this.companies[companyId].routes.push(route);
    });
    this.filtered = { ...this.companies }
    
    this.hideEmptyStateProgress()
  }

  filter(evt: any) {
    let filter = evt.target.value.toLowerCase();
    this.filtered = {};
    let keys = this.objectKeys(this.companies);
    keys.forEach((key) => {
      if (
        this.companies[key].name &&
        this.companies[key].name.toLowerCase().includes(filter)
      ) {
        this.filtered[key] = this.companies[key];
      } else {
        if (!this.companies[key].routes) return;
        this.companies[key].routes.forEach((route: any) => {
          if (
            (route.get("name") && route.get("name").toLowerCase().includes(filter)) ||
            (route.get("details") && route.get("details").toLowerCase().includes(filter))
          ) {
            if (!this.filtered[key]) {
              this.filtered[key] = {
                name: this.companies[key].name,
                socials: this.companies[key].socials,
                routes: [],
              };
            }
            this.filtered[key].routes.push(route);
          }
        });
      }
    });
  }
  isNew(createdAt: Date) {
    let current = new Date()
    return current.getTime() - createdAt.getTime() < this.days;
  }
  isUpdated(updatedAt: Date, createdAt: Date) {
    let current = new Date();
    return updatedAt.getTime() - createdAt.getTime() > this.days && current.getTime() - updatedAt.getTime() < this.days;
  }
  toggleFavorite(id: string) {

  }
}

