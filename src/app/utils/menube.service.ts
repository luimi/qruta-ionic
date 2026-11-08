import { Injectable } from '@angular/core';
import Parse from 'parse';
import { constants } from './constants';

@Injectable({
    providedIn: 'root'
})
export class MenubeService {

    /**
     * Obtiene los comercios de Menube cercanos a las coordenadas dadas.
     * @param lat latitud del punto de origen
     * @param lng longitud del punto de origen
     */
    public async getNearBy(lat: number, lng: number) {
        try {
            const result: any = await Parse.Cloud.run(constants.methods.getMenubeNearby, { lat, lng });
            return result || { businesses: [] };
        } catch (e) {
            return { businesses: [] };
        }
    }
}
