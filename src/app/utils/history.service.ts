import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  history: any[] = [];
  constructor(private utils: UtilsService) {
    this.history = JSON.parse(localStorage.getItem('history') || "[]");

  }
  public add(from: any, to: any, type: string) {
    if (!this.isRegistered(from, to)) {
      const walkDistance = this.utils.getLocal(constants.keys.walkDistance);
      const area = walkDistance ? walkDistance : 1;
      this.history.unshift({
        from: from,
        to: to,
        city: this.utils.getLocal('city'),
        area: area,
        type: type
      });
      localStorage.setItem('history', JSON.stringify(this.history));
    }
  }
  public get() {
    return this.history;
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
