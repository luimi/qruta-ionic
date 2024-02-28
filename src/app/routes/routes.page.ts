import { Component, OnInit, ViewChild } from '@angular/core';
import Parse from 'parse';
import { Router } from '@angular/router';
import { UtilsService } from '../utils/utils.service';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  companies: any = {};
  filtered: any = {};
  objectKeys = Object.keys;
  currentCity: any;
  @ViewChild('emptyState') emptyState: any;
  constructor(private router: Router, private utils: UtilsService) { }
  ngOnInit() {

  }
  async ionViewDidEnter() {
    const _city = this.utils.getLocal('city');
    if (this.currentCity && this.currentCity.objectId === _city.objectId) {
      return;
    }
    this.companies = {};
    if (this.emptyState) this.emptyState.showProgress();
    const City = Parse.Object.extend("City");
    const city = new City();
    this.currentCity = _city;
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
    if (this.emptyState)
      this.emptyState.hideProgress();
  }

  filter(evt: any) {
    let filter = evt.target.value.toLowerCase();
    this.filtered = {};
    let keys = this.objectKeys(this.companies).slice(0, -1);
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

