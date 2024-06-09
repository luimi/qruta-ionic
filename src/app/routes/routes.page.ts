import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { UtilsService } from '../utils/utils.service';
import { TabPage } from '../tab/tab.page';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage extends TabPage implements OnInit {
  companies: any = {};
  filtered: any = {};
  objectKeys = Object.keys;
  
  constructor(public override utils: UtilsService) { 
    super(utils)
  }
  async ionViewDidEnter() {
    if(this.isSameCity()) return
    else  this.companies = {};
    this.showEmptyStateProgress()
    const City = Parse.Object.extend("City");
    const city = new City();
    city.id = this.currentCity.objectId;
    let routes = await new Parse.Query('Route').equalTo('city', city).equalTo('status', true).select('name', 'company', 'details').include('company').ascending('name').limit(1000).find();
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
}

