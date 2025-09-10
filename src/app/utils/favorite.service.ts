import { Injectable } from '@angular/core';
import { constants } from './constants';
import Parse from 'parse';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  public favorites: any;
  favoritesIds: any;

  constructor(private utils: UtilsService) {
    if(this.favorites && this.favoritesIds) return;
    let data = localStorage.getItem(constants.local.favorites)
    if (!data) {
      this.favorites = [];
      this.favoritesIds = []
    }
    else {
      this.favoritesIds = JSON.parse(data)
      this.getFavorites()
    }
  }
  private async getFavorites() {
    if(this.favoritesIds.length > 0) this.favorites = await new Parse.Query('Route').containedIn("objectId", this.favoritesIds).equalTo('status', true).find()
  }

  public toggleFavorite(route: any){
    if(this.favoritesIds.includes(route.id)){
      this.favoritesIds = this.favoritesIds.filter((id: string) => id !== route.id)
      this.favorites = this.favorites.filter((_route: any) => _route.id !== route.id)
      this.utils.gaEvent("favorite-remove")
    } else {
      this.favorites.push(route);
      this.favoritesIds.push(route.id)
      this.utils.gaEvent("favorite-add")
    }
    this.save()
  }

  public isFavorite(id: string) {
    return this.favoritesIds.includes(id)
  }
  
  private save() {
    localStorage.setItem(constants.local.favorites, JSON.stringify(this.favoritesIds))
  }
}
