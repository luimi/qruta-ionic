import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import { constants } from 'src/app/utils/constants';
import { UtilsService } from 'src/app/utils/utils.service';
import moment from 'moment';

@Component({
  selector: 'app-removeadvertise',
  templateUrl: './removeadvertise.component.html',
  styleUrls: ['./removeadvertise.component.scss'],
  standalone: false
})
export class RemoveadvertiseComponent implements OnInit {
  benefits = [
    {
      icon: 'checkmark',
      text: "b1"
    },
    {
      icon: 'checkmark',
      text: "b2"
    },
    {
      icon: 'checkmark',
      text: "b3"
    },
    {
      icon: 'close',
      text: "b4"
    },
  ]

  plans: any;
  plansIds: any;
  user: any;
  plan: string = "";
  loading: boolean = false;
  link: string | undefined;
  subscription: any;

  constructor(public modalCtrl: ModalController, private utils: UtilsService) { }

  async ngOnInit() {
    this.checkUser()
    this.plans = await this.utils.getServerConfig("plans");
    this.plansIds = Object.keys(this.plans)
    this.plan = this.plansIds[0]
  }

  checkUser(isUser: boolean = true) {
    if (isUser) this.user = Parse.User.current();
    if(this.user) this.subscription = localStorage.getItem(constants.local.subscription);
  }

  setPlan(plan: string) {
    this.plan = plan;
  }

  async buyPlan() {
    this.loading = true;
    this.utils.gaEvent(`sub-${this.plan}`)
    let result = await Parse.Cloud.run(constants.methods.getPaymentLink, { plan: this.plan });
    if (result.success) {
      this.link = result.data.link
      window.open(result.data.link, '_blank')
    } else {
      this.utils.showAlert("removeAds.errors.e2")
    }
    this.loading = false;
  }

  async checkPay() {
    this.loading = true;
    const sub = await this.utils.checkSubscripction()
    if(!sub) this.utils.showAlert("removeAds.errors.e3");
    else this.modalCtrl.dismiss();
    this.loading = false;
  }

  getDaysLeft() {
    const expirationDate = moment(this.subscription)
    return expirationDate.diff(moment(), 'days')
  }

}
