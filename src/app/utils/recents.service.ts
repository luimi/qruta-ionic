import { Injectable } from '@angular/core';
import { UserData } from './userData.abstract';
import { constants } from './constants';

@Injectable({
    providedIn: 'root'
})
export class RecentsService extends UserData {
    constructor() {
        super(constants.local.recents, 4)
    }

    addRecent(location: any) {
        let isRegistered = false;
        this.data.forEach((entry: any) => {
            if (entry.address === location.address) {
                isRegistered = true;
            }
        });
        if (!isRegistered) {
            this.add(location)
        }
    }
}