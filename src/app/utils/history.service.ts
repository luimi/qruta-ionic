import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { constants } from './constants';
import { UserData } from './userData.abstract';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends UserData {
  history: any[] = [];

  constructor(private utils: UtilsService) {
    super(constants.local.history, 10);
  }
  public addHistory(from: any, to: any, type: string) {
    if (!this.isRegistered(from, to)) {
      const walkDistance = this.utils.getLocal(constants.keys.walkDistance);
      const area = walkDistance ? walkDistance : 1;
      const item = {
        from: from,
        to: to,
        city: this.utils.getLocal('city'),
        area: area,
        type: type
      }
      this.add(item)
    }
  }
  private isRegistered(from: any, to: any) {
    let isRegistered = false;
    this.history.forEach((record) => {
      if (record.from.address === from.address && record.to.address === to.address) {
        isRegistered = true;
      }
    });
    return isRegistered;
  }
}
