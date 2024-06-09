import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { constants } from '../utils/constants';
import { ApiService } from '../utils/api.service';
import { TabPage } from '../tab/tab.page';

@Component({
  selector: 'app-near-routes',
  templateUrl: './near-routes.page.html',
  styleUrls: ['./near-routes.page.scss'],
})
export class NearRoutesPage extends TabPage implements OnInit {

  routes: any = { urban: [], massive: [] };
  selectedBtn = 'urban';
  constructor(
    public override utils: UtilsService,
    private apiCtrl: ApiService
  ) {
    super(utils)
  }

  ionViewDidEnter() {
    if (this.isSameCity() && !this.isTimePassed(5)) return
    else this.routes = { urban: [], massive: [] }
    const warning = setTimeout(() => {
      this.setEmptyStateText('nearRoutes.location.hint');
    }, 5 * 1000);
    this.setEmptyState({icon: 'location', text: 'nearRoutes.location.search', progress: true})
    navigator.geolocation.getCurrentPosition((location) => {
      clearTimeout(warning);
      this.getNearRoutes(location.coords.latitude, location.coords.longitude);
    }, () => {
      clearTimeout(warning);
      this.setEmptyState({text: 'nearRoutes.location.error', progress: true})
    }, { enableHighAccuracy: true })
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
    this.setEmptyStateIcon('bus')
    this.setEmptyStateText('nearRoutes.search.searching')
    const server = await this.apiCtrl.getServer(data.city);
    if (!server.success) {
      this.setEmptyStateIcon('sad')
      this.setEmptyStateText('nearRoutes.search.notFound')
      this.hideEmptyStateProgress()
      return
    }
    const result = await this.apiCtrl.nearRoutes(server, data);
    this.hideEmptyStateProgress()
    if (result.success) {
      this.routes = result;
      if (this.routes.urban.length === 0 && this.routes.massive.length === 0) {
        this.setEmptyStateText('nearRoutes.search.notFound')
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
}
