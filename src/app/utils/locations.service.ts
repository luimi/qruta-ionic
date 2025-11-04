import { Injectable } from '@angular/core';
import { UserData } from './userData.abstract';
import { constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class LocationsService extends UserData {
    constructor() {
        super(constants.local.locations, 0)
    }
}