import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import moment from 'moment';
import { LoginComponent } from '../login/login.component';
import { UtilsService } from 'src/app/utils/utils.service';
import { constants } from 'src/app/utils/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  user: any;
  sub: any;
  @Output() onChanged = new EventEmitter<boolean>()
  constructor(private modalCtrl: ModalController, private utils: UtilsService) { }

  ngOnInit() {
    this.checkUser()
  }
  async openLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginComponent
    });
    modal.present();
    await modal.onWillDismiss()
    this.checkUser()
    if (this.onChanged) this.onChanged.emit(this.user !== null)
  }
  async logOut() {
    this.utils.showConfirmDialog("profile.logout", async () => {
      await Parse.User.logOut()
      delete this.user;
      localStorage.removeItem(constants.local.subscription)
    })
  }
  public async checkUser() {
    this.user = Parse.User.current();
    this.sub = localStorage.getItem(constants.local.subscription);
  }

  getDaysLeft() {
    const expirationDate = moment(this.sub)
    return expirationDate.diff(moment(), 'days')
  }
}
