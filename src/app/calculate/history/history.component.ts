import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { constants } from 'src/app/utils/constants';
import { UtilsService } from 'src/app/utils/utils.service';
import Parse from 'parse';
import { HistoryService } from 'src/app/utils/history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  list: any[] = [];
  constructor(private history: HistoryService, private router: Router, private utils: UtilsService, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.list = this.history.get();
  }
  async calculate(path: any) {
    const loading = await this.utils.showLoading("calculate.history.calculating");
    const response = await Parse.Cloud.run("calculate", {
      start: path.from.location,
      end: path.to.location,
      area: path.area,
      city: path.city.objectId,
      type: path.type
    });
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
