import { Component, OnInit, ViewChild } from '@angular/core';
import Parse from 'parse';
import { ModalController } from '@ionic/angular';
@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    standalone: false
})
export class FaqComponent implements OnInit {
  qr: any[] = [];
  search: string = "";
  loading: boolean = true;
  @ViewChild('emptyState') emptyState:any;
  constructor(public modalCtrl: ModalController) { }

  async ngOnInit() {
    
  }
  async ionViewDidEnter() {
    this.emptyState.showProgress()
    this.qr = await new Parse.Query('FAQ').find();
    if(this.qr.length > 0) this.loading = false
    else {
      this.emptyState.setText("No se encontró preguntas")
      this.emptyState.hideProgress()
    }
  }
  getQr() {
    if (!this.search) {
      return this.qr;
    }
    const filter = Object.assign([], this.qr).filter(
      (item: any) => item.get('question').toLowerCase().indexOf(this.search.toLowerCase()) > -1
    )
    return filter;
  }
}
