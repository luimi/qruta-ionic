import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { constants } from './constants';
import 'leaflet';
import 'leaflet-polylinedecorator';
declare let L: any;

@Injectable({
  providedIn: 'root'
})
export class LeafletHelperService {
  public isInitialized: boolean = false;
  private layers: any[] = [];
  private city: any;
  private maps: any = {};
  private currentLayer: any;
  private tracker: any;
  constructor(private utils: UtilsService) {
    this.layers.push({
      id: '0',
      title: 'Google',
      layer: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      attribution: 'Google'
    });
    this.layers.push({
      id: '1',
      title: 'OpenStreetMap',
      layer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    });
    this.layers.push({
      id: '2',
      title: 'Oscuro',
      layer: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution: 'Stadia Maps'
    });
    this.layers.push({
      id: '3',
      title: 'Grafito',
      layer: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '<a href="https://opentopomap.org">OpenTopoMap</a>'
    });
    this.layers.push({
      id: '4',
      title: 'Satélite',
      layer: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'ArcGIS'
    });
    

    this.setMarkerRotation();

  }
  public initialize(id: string) {
    if (this.maps[id]) {
      return this.maps[id].layer;
    }
    this.city = this.utils.getLocal(constants.keys.city);
    const location = this.city ? this.city.location : {latitude: 0, longitude: 0};
    const zoom = this.city && this.city.zoom ? this.city.zoom : 12
    let selectedLayerId = localStorage.getItem(constants.keys.layer)
    let selectedLayer = this.layers[selectedLayerId ? this.layers.map((layer) => layer.id).indexOf(selectedLayerId) : 0];
    const map = new L.Map(id, { zoomControl: false }).setView([location.latitude, location.longitude], zoom);
    this.currentLayer = L.tileLayer(selectedLayer.layer, {
      attribution: selectedLayer.attribution,
      maxZoom: 18,
      minZoom: 0
    });
    this.currentLayer.addTo(map);
    this.isInitialized = true;
    this.maps[id] = { layer: map };
    this.startTracking();
    return map;
  }
  public startTracking() {
    if (this.tracker) return;
    this.tracker = navigator.geolocation.watchPosition((data: any) => {
      if (data.code) return;
      Object.values(this.maps).forEach((map: any) => {
        const location = [data.coords.latitude, data.coords.longitude];
        if (map.locationMarker) {
          if (map.locationMarker.getLatLng().distanceTo(location) > 400) {
            map.locationMarker.setLatLng(location);
          } else {
            this.moveTo(map.locationMarker, location);
          }
        } else {
          map.locationMarker = this.addMarker(map.layer, location, "", './assets/location.png', [15, 15]);
        }
      });
    }, (error) => { }, { maximumAge: 5000, enableHighAccuracy: true });
  }
  public stopTracking() {
    if (this.tracker) {
      navigator.geolocation.clearWatch(this.tracker);
    }
  }
  public getMap(id: string) {
    return this.maps[id];
  }
  public removeMap(id: string) {
    try {
      this.maps[id].layer.remove();
      delete this.maps[id];
    } catch (e) { }
  }
  public setLayer(id: string, index: number) {
    if(!this.maps[id]) return
    this.maps[id].layer.removeLayer(this.currentLayer);
    const selectedLayer = this.layers[index];
    this.currentLayer = L.tileLayer(selectedLayer.layer, {
      attribution: selectedLayer.attribution,
      maxZoom: 18,
      minZoom: 0
    });
    this.maps[id].layer.addLayer(this.currentLayer);
  }
  public addPolyline(map: any, path: number[][], color: string, dashed?: boolean, arrows?: boolean) {
    let options: any = { color: color, weight: 8, opacity: 0.6 };
    if (dashed) {
      options.dashArray = '5, 10';
    }

    let pl = L.polyline(path, options).addTo(map);
    if(arrows)
    L.polylineDecorator(pl, {
      patterns: [
        { offset: 0, repeat: 100, symbol: L.Symbol.arrowHead({ pixelSize: 8, polygon: true, pathOptions: { stroke: true, color: color } }) }
      ]
    }).addTo(map);
    return pl;
  }
  public addMarker(map: any, location: number[], title?: string, iconUrl?: string, size?: number[]) {
    let options: any = {};
    if (title) {
      options.title = title;
    }
    if (iconUrl) {
      let i = L.icon({
        iconUrl: iconUrl,
        iconSize: size ? size : [23, 32],
        iconAnchor: size ? [size[0] / 2, size[1]] : [11, 32],
        popupAnchor: [0, -32]
      });
      options.icon = i;

    }
    let m = L.marker(location, options).addTo(map);
    return m;
  }
  public addBusMarker(map: any, location: number[], title: string, angle: number) {
    //http://jsfiddle.net/z2er1pbc/
    let options: any = {};
    options.title = title;
    let i = L.icon({
      iconUrl: 'assets/bus.png',
      iconSize: [80, 80],
      iconAnchor: [40, 40]
    });
    options.icon = i;
    let m = L.marker(location, options).addTo(map);
    m.setIconAngle(angle);
    return m;
  }
  public centerMap(map: any, objects: any[]) {
    let group = L.featureGroup(objects);
    map.fitBounds(group.getBounds());
  }
  public moveCamera(map: any, location: number[], zoom?: number) {
    try {
      map.flyTo(location, zoom);
    } catch (e) {
      console.log('moveCamera', e);
    }

  }
  public setCamera(map: any, location: number[], zoom: number) {
    map.setView(location, zoom);
  }
  public getLayers() {
    return this.layers;
  }
  public computeDistanceBetween(from: number[], to: number[]) {
    let radFromLat = this.toRadians(from[0])
    let radFromLng = this.toRadians(from[1]);
    let radToLat = this.toRadians(to[0])
    let radToLng = this.toRadians(to[1]);
    return 2 * Math.asin(Math.sqrt(
      Math.pow(Math.sin((radFromLat - radToLat) / 2), 2)
      + Math.cos(radFromLat) * Math.cos(radToLat) *
      Math.pow(Math.sin((radFromLng - radToLng) / 2), 2)
    )) * 6378137;
  }
  private toRadians(angleDegrees: number) {
    return angleDegrees * Math.PI / 180.0;
  }
  public moveTo(marker: any, location: number[]) {
    const distanceBtwnPoints = 10;
    const timeBtwnPoints = 50;
    let ml = marker.getLatLng();
    ml = [ml.lat, ml.lng];
    let segments = Math.floor(this.computeDistanceBetween(ml, location) / distanceBtwnPoints);
    if (segments > 1) {
      for (let i = 0; i < segments; i++) {
        setTimeout(() => {
          marker.setLatLng(this.computeOffset(ml, (distanceBtwnPoints * i), location));
        }, timeBtwnPoints * i);

      }
    }
  }
  private computeOffset(from: number[], distance: number, to: number[]) {
    distance /= 6378137;
    let fromLat = this.toRadians(from[0]);
    let toLat = this.toRadians(to[0]);
    let deltaLng = this.toRadians(to[1]) - this.toRadians(from[1]);
    let fmod = (a: number, b: number) => Number((a - (Math.floor(a / b) * b)).toPrecision(8));
    let angle = this.toDegrees(
      Math.atan2(
        Math.sin(deltaLng) * Math.cos(toLat),
        Math.cos(fromLat) * Math.sin(toLat) -
        Math.sin(fromLat) * Math.cos(toLat) * Math.cos(deltaLng)
      )
    );
    if (angle === 180) { }
    else {
      angle = fmod((fmod((angle - -180), 360) + 360), 360) + -180;
    }
    let heading = this.toRadians(angle);

    let cosDistance = Math.cos(distance);
    let sinDistance = Math.sin(distance);
    let sinFromLat = Math.sin(fromLat);
    let cosFromLat = Math.cos(fromLat);
    let sc = cosDistance * sinFromLat + sinDistance * cosFromLat * Math.cos(heading);
    return [
      this.toDegrees(Math.asin(sc)),
      this.toDegrees(this.toRadians(from[1]) +
        Math.atan2(sinDistance * cosFromLat * Math.sin(heading),
          cosDistance - sinFromLat * sc))
    ];
  }
  private toDegrees(radians: number) {
    return radians * 180 / Math.PI;
  }
  setMarkerRotation() {
    var _old__setPos = L.Marker.prototype._setPos;
    L.Marker.include({
      _updateImg: function (i: any) {
        i.style[L.DomUtil.TRANSFORM] += "rotate(" + this.options.iconAngle + "deg)";
        i.style[L.DomUtil.TRANSFORM + 'Origin'] = 'center center';
      },

      setIconAngle: function (iconAngle: number) {
        this.options.iconAngle = iconAngle;
        if (this._map) this.update();
      },

      _setPos: function (pos: any) {
        if (this._icon) {
          this._icon.style[L.DomUtil.TRANSFORM] = "";
        }
        if (this._shadow) {
          this._shadow.style[L.DomUtil.TRANSFORM] = "";
        }

        _old__setPos.apply(this, [pos]);

        if (this.options.iconAngle) {
          var a = this.options.icon.options.iconAnchor;
          var s = this.options.icon.options.iconSize;
          var i;
          if (this._icon) {
            i = this._icon;
            this._updateImg(i, a, s);
          }

        }
      }
    });
  }
}
