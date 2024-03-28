import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  city;
  corsAnyWhere = "https://lui2mi-corsanywhere.fly.dev";
  gap = 0.5;
  link: any = {
    geocode:{
      arcgis:(address: string,server:any)=>{
        const location = this.city.location;
        return `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address=${address.trim()}&searchExtent=${location.longitude-this.gap},${location.latitude-this.gap},${location.longitude+this.gap},${location.latitude+this.gap}&maxLocations=5&outFields=city&forStorage=false&f=json`;
      },
      google:(address: string,server:any)=>{
        const location = this.city.location;
        return `https://maps.googleapis.com/maps/api/geocode/json?key=${server.key}&address=${address.trim()}&bounds=${location.latitude-this.gap},${location.longitude-this.gap}|${location.latitude+this.gap},${location.longitude+this.gap}`;
      },
      bing:(address: string,server:any)=>{
        return `https://dev.virtualearth.net/REST/v1/Locations?q=${address}&key=${server.key}`;
      }
    },
    reverse:{
      arcgis:(location: number[],server: any)=>{
        return `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${location[1]},${location[0]}&f=json`;
      },
      google:(location: number[],server:any)=>{
        return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location[0]},${location[1]}&key=${server.key}`;
      },
      bing:(location:number[],server:any)=>{
        return `https://dev.virtualearth.net/REST/v1/Locations/${location[0]},${location[1]}?key=${server.key}`;
      }
    },
    walkto:{
      custom_osrm:(data:any,server:any)=>{
        return `${server.link}/route/v1/walking/${data.from[1]},${data.from[0]};${data.to[1]},${data.to[0]}`;
      },
      osrm:(data:any,server:any)=>{
        return `https://router.project-osrm.org/route/v1/walking/${data.from[1]},${data.from[0]};${data.to[1]},${data.to[0]}`;
      },
      arcgis:(data:any,server:any)=>{
        return `https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?stops=${data.from[1]},${data.from[0]};${data.to[1]},${data.to[0]}&f=json&travelMode=5&token=${server.key}`;
      },
      google:(data:any,server:any)=>{
        return `${this.corsAnyWhere}/https://maps.googleapis.com/maps/api/directions/json?origin=${data.from[0]},${data.from[1]}&destination=${data.to[0]},${data.to[1]}&key=${server.key}&mode=walking`;
      },
      bing:(data:any,server:any)=>{
        return `https://dev.virtualearth.net/REST/v1/Routes/walking?wayPoint.1=${data.from[0]},${data.from[1]}&wayPoint.2=${data.to[0]},${data.to[1]}&key=${server.key}`;
      }
    },
    places:{
      nominatim:(place:string,server:any) => {
        const location = this.city.location;
        return `https://nominatim.openstreetmap.org/search?format=json&limit=50&bounded=1&q=${place.trim()}&viewbox=${location.longitude-this.gap},${location.latitude-this.gap},${location.longitude+this.gap},${location.latitude+this.gap}`;
      },
      custom_nominatim:(place:string,server:any) => {
        const location = this.city.location;
        return `${server.link}/search?format=json&limit=50&bounded=1&q=${place.trim()}&viewbox=${location.longitude-this.gap},${location.latitude-this.gap},${location.longitude+this.gap},${location.latitude+this.gap}`;
      }
    }
  }
  process:any = {
    geocode:{
      arcgis:(result:any)=>{
        return result.candidates.map((obj:any)=>{
          return {
            address: obj.address,
            city:obj.attributes.City,
            location:[obj.location.y,obj.location.x]
          };
        });
      },
      google:(result:any)=>{
        const locations: any[] = [];
        if(result.results.length>0){
          result.results.forEach((place:any) =>{
            let location = place.geometry.location;
            locations.push({
              address: place.formatted_address,
              city:this.getCityFromGoogle(place.address_components),
              location:[location.lat,location.lng]
            });
          });
        }
        return locations;
      },
      bing:(result:any)=>{
        let places = result.resourceSets[0].resources;
        const locations: any[] = [];
        
        places.forEach((place:any) =>{
          let location = place.point.coordinates;
          locations.push({
            address: place.name,
            city:place.address.locality,
            location:[location[0],location[1]]
          });
        });
        return locations;
      }
    },
    reverse:{
      arcgis:(result:any)=>{
        return {
          address: result.address.Address,
          city: result.address.City,
          location: [result.location.y,result.location.x]
        }
      },
      google:(result:any)=>{
        let place = result.results[0];
        let location = place.geometry.location;
        return {
          address: place.formatted_address,
          city: this.getCityFromGoogle(place.address_components),
          location: [location.lat,location.lng]
        }
      },
      bing:(result:any)=>{
        let place = result.resourceSets[0].resources[0];
        let location = place.point.coordinates;
        return {
          address: place.name,
          city:place.address.locality,
          location:[location[0],location[1]]
        }
      }
    },
    walkto:{
      custom_osrm:(result:any)=>{
        return result.routes[0].geometry;
      },
      osrm:(result:any)=>{
        return result.routes[0].geometry;
      },
      arcgis:(result:any)=>{
        if(!result || !result.routes) return
        const route = result.routes.features[0].geometry.paths[0];
        const path:any[]=[];
        route.forEach((step:number[]) => {
          path.push([step[1],step[0]]);
        });
        const encoded = this.encode(path);
        return encoded;
      },
      google:(result:any)=>{
        return result.routes[0].overview_polyline.points;
      },
      bing:(result:any)=>{
        const items = result.resourceSets[0].resources[0].routeLegs[0].itineraryItems;
        const path: any[] = [];
        items.forEach((element:any) => {
          let location = element.maneuverPoint.coordinates;
          path.push([location[0],location[1]]);
        });
        return this.encode(path);
      }
    },
    places:{
      nominatim:(result:any[])=>{
        return result.map((obj) => {
          return {
            address: obj.display_name,
            city:'',
            location:[obj.lat, obj.lon]
          };
        });
      },
      custom_nominatim:(result:any[])=>{
        return result.map((obj) => {
          return {
            address: obj.display_name,
            city:'',
            location:[obj.lat, obj.lon]
          };
        });
      }
    }
  }
  constructor(private http: HttpClient,private utils: UtilsService) { 
    this.city = this.utils.getLocal(constants.keys.city);
  }
  public updateCity(){
    this.city = this.utils.getLocal(constants.keys.city);
  }
  public geocode(address:string){
    return this.execute('geocode',address);
  }
  public reverse(location:number[]){
    return this.execute('reverse',location)
  }
  public walkTo(from:string,to:string){
    return this.execute('walkto',{from:from,to:to});
  }
  public places(address:string) {
    return this.execute('places',address);
  }
  public encode(path:any[], precision?: number) {
    var i, dlat, dlng;
    var plat = 0;
    var plng = 0;
    var encoded_points = '';

    precision = Math.pow(10, precision || 5);

    for (i = 0; i < path.length; i++) {
      var lat = path[i][0];
      var lng = path[i][1];
      var latFloored = Math.floor(lat * precision);
      var lngFloored = Math.floor(lng * precision);
      dlat = latFloored - plat;
      dlng = lngFloored - plng;
      plat = latFloored;
      plng = lngFloored;
      encoded_points += this.encodeSignedNumber(dlat) + this.encodeSignedNumber(dlng);
    }
    return encoded_points;
  }
  public decode(str:string, precision?:number) {
      var index = 0,
          lat = 0,
          lng = 0,
          coordinates = [],
          shift = 0,
          result = 0,
          byte = null,
          latitude_change,
          longitude_change,
          factor = Math.pow(10, precision || 5);

      // Coordinates have variable length when encoded, so just keep
      // track of whether we've hit the end of the string. In each
      // loop iteration, a single coordinate is decoded.
      while (index < str.length) {

          // Reset shift, result, and byte
          byte = null;
          shift = 0;
          result = 0;

          do {
              byte = str.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
          } while (byte >= 0x20);

          latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

          shift = result = 0;

          do {
              byte = str.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
          } while (byte >= 0x20);

          longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

          lat += latitude_change;
          lng += longitude_change;

          coordinates.push([lat / factor, lng / factor]);
      }
      return coordinates;
  }
  private async execute(method:string,data:any){
    if(method === 'geocode')
      data = data.replace('#','%23');
    return new Promise(async (result,reject) => {
      let servers: any = await this.utils.getServerConfig(method);
      let response: any;
      for (let i = 0; i < servers.length; i++){
        try{
          response = await this.rest(this.link[method][servers[i].type](data, servers[i]));
          if (servers[i].type === 'google') {
            if (response.status === 'OK') {
              response = this.process[method][servers[i].type](response);
              break;
            } else {
              console.log('generate error');
            }
          } else {
            response = this.process[method][servers[i].type](response);
            break;
          }
        }catch(e){
          console.log('generate error ',e);
        }
      }
      result(response);
    });
  }
  private async rest(url:string){
    return new Promise((result,reject) => {
      this.http.get(url).subscribe((data)=>{
        result(data);
      },error=>{
        reject();
      });
    });
  }
  private getCityFromGoogle(components:any[]){
    let city:any;
    components.forEach((element )=> {
      if(element.types.indexOf("administrative_area_level_2") > -1 && !city){
        city = element.long_name;
      }
    });
    return city;
  }
  private encodeSignedNumber(num:number) {
    var encodeNumber = function (num:number) {
      var encodeString = '';
      var nextValue, finalValue;
      while (num >= 0x20) {
        nextValue = (0x20 | (num & 0x1f)) + 63;
        encodeString += (String.fromCharCode(nextValue));
        num >>= 5;
      }
      finalValue = num + 63;
      encodeString += (String.fromCharCode(finalValue));
      return encodeString;
    };
		var sgn_num = num << 1;
		if (num < 0) {
			sgn_num = ~(sgn_num);
		}

		return encodeNumber(sgn_num);
  };
  
}
