import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import Parse from 'parse';
import { UtilsService } from '../utils/utils.service';
import { Router } from '@angular/router';
import { constants } from '../utils/constants';

@Component({
  selector: 'app-near-routes',
  templateUrl: './near-routes.page.html',
  styleUrls: ['./near-routes.page.scss'],
})
export class NearRoutesPage implements OnInit {

  routes: any = { urban: [], massive: [] };
  selectedBtn = 'urban';
  loadedRoutes = false;
  @ViewChild('emptyState') emptyState: any;
  constructor(
    private alertCtrl: AlertController,
    private utils: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    if (!this.loadedRoutes) {
      this.getCurrentPosition();
    }
  }

  /**
   * this get user current position and call routes
   */
  async getCurrentPosition() {
    const warning = setTimeout(() => {
      this.emptyState.setText('nearRoutes.location.hint');
    }, 5 * 1000);
    this.emptyState.setIcon('location');
    this.emptyState.setText('nearRoutes.location.search');
    this.emptyState.showProgress();
    navigator.geolocation.getCurrentPosition((location) => {
      clearTimeout(warning);
      this.getNearRoutes(location.coords.latitude, location.coords.longitude);
    }, () => {
      clearTimeout(warning);
      this.emptyState.setText('nearRoutes.location.error');
      this.emptyState.hideProgress();
    },{ enableHighAccuracy: true })
  }

  /**
   * this get all near routes
   * @param lat latitude
   * @param lng longitude
   */
  async getNearRoutes(lat: number, lng: number) {
    const data = {
      location: [lat, lng],
      city: this.utils.getLocal(constants.keys.city).objectId,
      area: 1
    };
    this.emptyState.setIcon('bus');
    this.emptyState.setText('nearRoutes.search.searching');
    const result = await Parse.Cloud.run(constants.methods.nearRoutes, data);
    this.emptyState.hideProgress();
    if (result.success) {
      this.routes = result;
      this.loadedRoutes = true;
      if (this.routes.urban.length === 0 && this.routes.massive.length === 0) {
        this.emptyState.setText('nearRoutes.search.notFound');
      }
    } else {
      this.utils.showErrorByCode(result.codeError, constants.errors.nearRoutes);
    }
  }

  /**
   * this return the selected routes
   */
  getCorrectRoutes() {
    return this.routes[this.selectedBtn];
  }

  /**
   * this show an error alert
   * @param message error message
   */
  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    return await alert.present();
  }

  /**
   * this execute when user select a route
   * @param id 
   */
  didSelectedRoute(id: string) {
    this.router.navigateByUrl('route/' + id);
  }
}
