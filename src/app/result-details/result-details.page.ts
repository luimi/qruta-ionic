import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LeafletHelperService } from '../utils/leaflet-helper.service';
import { UtilsService } from '../utils/utils.service';
import { GeoService } from '../utils/geo.service';
import { Platform } from '@ionic/angular';
import { constants } from '../utils/constants';
@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.page.html',
  styleUrls: ['./result-details.page.scss'],
})
export class ResultDetailsPage implements OnInit {
  map:any;
  option:any;
  data:any;
  colors = ['blue', 'red', 'green'];
  @ViewChild('top') top: ElementRef | undefined;
  constructor(private route: ActivatedRoute, private location: Location, private leaflet: LeafletHelperService, private utils: UtilsService, private geo: GeoService, private platform: Platform) { }

  ngOnInit() {
    let position = this.route.snapshot.paramMap.get('index');
    if (position === undefined) {
      this.location.back();
      return;
    }
    this.data = this.utils.getSess(constants.local.result);
    this.option = this.data.options[position|| 0];
    
  }
  ionViewDidEnter() {
    this.loadData();
  }
  async loadData() {
    let loading = await this.utils.showLoading('result.detail.dialogs.loading');
    let routes = this.option.routes;
    if(this.leaflet.getMap('details')){
      this.leaflet.removeMap('details');
    }
    this.map = this.leaflet.initialize('details');
    let start = this.leaflet.addMarker(this.map,this.data.start, 'Inicio', './assets/origen.png');
    let walkToBus:any = await this.geo.walkTo(this.data.start, routes[0].startPoint);
    if(walkToBus) this.leaflet.addPolyline(this.map,this.geo.decode(walkToBus|| ""), 'black', true);
    let walkToDestination:any = await this.geo.walkTo(routes[routes.length - 1].endPoint, this.data.end);
    if(walkToDestination) this.leaflet.addPolyline(this.map,this.geo.decode(walkToDestination), 'black', true);
    let end = this.leaflet.addMarker(this.map,this.data.end, 'Fin', './assets/destino.png');
    routes.forEach(async (route: any, index: number) => {
      let stops = route.route.stops;
      stops.forEach((stop:any[]) => {
        const marker = this.leaflet.addMarker(this.map, stop, stop[2], './assets/stop.png', [40, 45]);
        marker.bindPopup(stop[2]);
      });
      if(stops.length>0){
        let first = stops[0];
        let last = stops[stops.length-1];
        route.startAddress = {address:first[2],location:[first[0],first[1]],city:''};
        route.endAddress = {address:last[2],location:[last[0],last[1]],city:''};
      } else {
        route.startAddress = await this.geo.reverse(route.startPoint);
        route.endAddress = await this.geo.reverse(route.endPoint);
      }
      this.leaflet.addPolyline(this.map, this.geo.decode(route.route.polyline), this.colors[index]);
    });
    this.data.endAddress = await this.geo.reverse(this.data.end);
    this.leaflet.centerMap(this.map, [start,end]);
    loading.dismiss();
  }
  moveCamera(location:any) {
    this.leaflet.moveCamera(this.map, location, 16);
    if(this.top) this.top.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
