import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoService } from 'src/app/utils/geo.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { AddressMapComponent } from '../address-map/address-map.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-address-modal',
    templateUrl: './address-modal.component.html',
    styleUrls: ['./address-modal.component.scss'],
    standalone: false
})
export class AddressModalComponent implements OnInit {

  constructor(
    private geo: GeoService,
    private utils: UtilsService,
    private changeRef: ChangeDetectorRef,
    public modalCtrl: ModalController,
    private translateCtrl: TranslateService) { }

  address: any = '';
  options: any;
  searchTimeOut: any;
  secondsTimeOut = 1
  favorites: any[] = [];
  recents: any[] = [];
  textMaxLength = 1;
  type = 'place';
  progress = false;
  ngOnInit() {
    this.getFavorites();
    this.getRecents();
  }

  search(e: any) {
    if (this.address !== '' && this.address.trim().length > this.textMaxLength) {
      this.progress = true;
      if (this.searchTimeOut) {
        clearTimeout(this.searchTimeOut);
      }
      this.searchTimeOut = setTimeout(async () => {
        //const loading = await this.utils.showLoading('Cargando...');
        if (this.type === 'address') {
          this.options = await this.geo.geocode(this.address);
        } else {
          this.options = await this.geo.places(this.address);
        }
        this.progress = false;
        //loading.dismiss();
      }, this.secondsTimeOut * 1000);
    } else {
      this.progress = false;
    }
  }
  select(address: any, type: string) {
    this.utils.gaEvent(`calculate-selected-${type}`)
    this.modalCtrl.dismiss(address);
  }
  async selectFromMap() {
    const modal = await this.modalCtrl.create({
      component: AddressMapComponent
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      this.modalCtrl.dismiss(result.data);
    }
  }

  addFavorite(address: any) {
    const index = this.favorites.findIndex(
      item => item.address === address.address
    )
    if (index === -1) {
      this.favorites.push(address);
      this.saveFavorites();
      this.utils.showAlert("calculate.modal.dialogs.favoriteAdded");
    } else {
      this.utils.showAlert("calculate.modal.dialogs.favoriteExists");
    }
    this.utils.gaEvent("calculate-favorite-added")
  }
  getFavorites() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || "[]");
    if (!this.favorites) {
      this.favorites = [];
    }
  }
  deleteFavorite(index: number) {
    this.translateCtrl.get("calculate.modal.dialogs.favoriteDelete").subscribe(res => {
      this.utils.showConfirmDialog(res, () => {
        this.utils.gaEvent("calculate-favorite-deleted")
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.changeRef.detectChanges();
      });
    })
  }
  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.getFavorites();
  }
  getRecents() {
    this.recents = JSON.parse(localStorage.getItem('recents') || "[]");
  }

  /**
   * this close view
   */
  closeView() {
    this.modalCtrl.dismiss();
  }
}
