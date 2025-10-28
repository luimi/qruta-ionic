import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import { LoginComponent } from '../login/login.component';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any;
  constructor(private modalCtrl: ModalController, private utils: UtilsService) { }

  ngOnInit() {
    this.user = Parse.User.current()
  }
  async openLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginComponent
    });
    modal.present();
    await modal.onWillDismiss()
    this.user = Parse.User.current()
  }
  async logOut() {
    this.utils.showConfirmDialog("¿Deseas cerrar la sesion de este usuario?", async () => {
      await Parse.User.logOut()
      delete this.user;
    })
  }
}
