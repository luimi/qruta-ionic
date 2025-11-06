import { Injectable } from '@angular/core';
import { constants } from './constants';
import Parse from 'parse';
import { UtilsService } from './utils.service';
import { UserData } from './userData.abstract';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends UserData {
  public favorites: any = [];

  constructor(private utils: UtilsService) {
    super(constants.local.favorites)
    this.fill()
  }

  public fill() {
    this.get();
    this.getFavorites()
  }
  private async getFavorites() {
    this.favorites = [];
    if (this.data.length > 0) this.favorites = await new Parse.Query('Route').containedIn("objectId", this.data).equalTo('status', true).find()
  }

  public toggleFavorite(route: any) {
    if (this.data.includes(route.id)) {
      this.removeById(route.id);
      //this.data = this.data.filter((id: string) => id !== route.id)
      this.favorites = this.favorites.filter((_route: any) => _route.id !== route.id)
      this.utils.gaEvent("favorite-remove");
    } else {
      this.favorites.push(route);
      this.add(route.id, true);
      //this.data.push(route.id)
      this.utils.gaEvent("favorite-add");
    }
  }

  public isFavorite(id: string) {
    return this.data.includes(id)
  }
}
