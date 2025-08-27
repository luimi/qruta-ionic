import { Component, OnInit } from '@angular/core';
import { constants } from '../utils/constants';
import { Router } from '@angular/router';
import { UtilsService } from '../utils/utils.service';
import * as Parse from 'parse';
import { GeoService } from '../utils/geo.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage implements OnInit {

  cities: any[] = [];
  toggleLoading = true;

  constructor(private router: Router, private utils: UtilsService, private geo: GeoService) { }

  ngOnInit() {
    if(localStorage.getItem(constants.keys.city)) this.goToMain();
    this.getCities();
  }
  async getCities() {
    const loading = await this.utils.showLoading('cities.dialogs.loading');
    const query = new Parse.Query("City");
    query.ascending('name');
    query.equalTo('status', true);
    query.include('massive');
    query.find().then( (citiesResponse: any[]) => {
      this.cities = citiesResponse;
      loading.dismiss();
      if(this.cities.length===1) this.selectCity(this.cities[0])
    });
  }
  selectCity(city:any) {
    this.utils.gaEvent(`city-${city.get("name").tolowerCase().replaceAll(' ', '-')}`);
    this.utils.setLocal(constants.keys.city, city);
    this.geo.updateCity();
    this.goToMain();
  }
  goToMain() {
    this.router.navigate(['main/calculate'])
  }
}
