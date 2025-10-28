import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../utils/utils.service';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.page.html',
    styleUrls: ['./tab.page.scss'],
    standalone: false
})
export class TabPage implements OnInit {
  currentCity: any;
  currentTime: number = 0;
  @ViewChild('emptyState') emptyState: any;

  constructor(public utils: UtilsService) { }

  ngOnInit() {
    this.renewCurrentTime()
  }
  isSameCity() {
    const city = this.utils.getLocal('city');
    const isSameCity = this.currentCity && this.currentCity.objectId === city.objectId
    if (!isSameCity) this.currentCity = city
    return isSameCity
  }
  isTimePassed(minutes: number) {
    return new Date().getTime() - this.currentTime > 1000*60*minutes
  }
  renewCurrentTime(){
    this.currentTime = new Date().getTime()
  }
  showEmptyStateProgress() {
    if (this.emptyState) this.emptyState.showProgress();
  }
  hideEmptyStateProgress() {
    if (this.emptyState) this.emptyState.hideProgress();
  }
  setEmptyStateText(text: string) {
    if (this.emptyState) this.emptyState.setText(text)
  }
  setEmptyStateIcon(icon: string) {
    if (this.emptyState) this.emptyState.setIcon(icon);
  }
  setEmptyState(changes: any){
    if(this.emptyState) this.emptyState.apply(changes)
  }

}
