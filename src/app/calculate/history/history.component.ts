import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { constants } from 'src/app/utils/constants';
import { UtilsService } from 'src/app/utils/utils.service';
import Parse from 'parse';
import { HistoryService } from 'src/app/utils/history.service';
import { ApiService } from 'src/app/utils/api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  list: any[] = [];
  distances: any = {
    1: '500m',
    2: '1km',
    3: '1.5km',
  };
  constructor(private history: HistoryService, private router: Router, private utils: UtilsService, public modalCtrl: ModalController, private apiCtrl: ApiService) { }

  ngOnInit() {
    this.list = this.history.get();
  }
  async calculate(path: any) {
    const loading = await this.utils.showLoading("calculate.history.calculating");
    const data = {
      start: path.from.location,
      end: path.to.location,
      area: path.area,
      city: path.city.objectId,
      type: path.type
    }
    const server = await this.apiCtrl.getServer(data.city)
    if (!server.success) {
      loading.dismiss();
      this.utils.showAlert('calculate.main.errors.highDemand');
      return
    }
    const response = await this.apiCtrl.calculate(server, data)
    loading.dismiss();
    if (response.success) {
      sessionStorage.setItem('result', JSON.stringify(response));
      this.router.navigateByUrl('/result');
      this.modalCtrl.dismiss();
    } else {
      this.utils.showErrorByCode(response.codeError, constants.errors.calculate);
    }
  }


}
