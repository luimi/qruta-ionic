import { Injectable } from '@angular/core';
import Parse from 'parse';
import { UtilsService } from './utils.service';
import { constants } from './constants';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private places: any[] | undefined = undefined;
    private city: any;

    constructor(private utils: UtilsService) { }

    async getPlaces() {
        let currentCityId = this.utils.getLocal(constants.keys.city).objectId;
        if (!this.city) this.setCurrentCity();
        if (!this.places || this.city.id !== currentCityId) {
            this.setCurrentCity();
            let placemarks = await new Parse.Query("PlaceMark").equalTo("city", this.city).equalTo("status", true).find();
            if (!placemarks) placemarks = []
            this.places = placemarks.map((place) => {
                return {
                    address: place.get('title'),
                    city: place.get('cityName'),
                    location: [place.get("location").latitude, place.get("location").longitude],
                    icon: place.get('icon'),
                    size: place.get('size')
                }
            })
        }
        return this.places;
    }
    private setCurrentCity() {
        this.city = new Parse.Object("City")
        this.city.id = this.utils.getLocal(constants.keys.city).objectId;
    }
}