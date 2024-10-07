import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardsService } from 'src/app/utils/cards.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss'],
})
export class CardAddComponent implements OnInit {
  cardNumber: string = ""
  loading: boolean = false
  cardInfo: any = {}
  cardStyles: any = [
    {title: "Plaza de Toros", image: "./assets/cards/plaza_de_toros.jpg", orientation: "style1"},
    {title: "Parque Espíritu del Manglar", image: "./assets/cards/parque_espiritu_del_manglar.jpg", orientation: "style1"},
    {title: "Solo Bus", image: "./assets/cards/solo_bus.jpg", orientation: "style3"},
    {title: "Torre del Reloj", image: "./assets/cards/torre_del_reloj.jpg", orientation: "style2"},
  ]
  cardStyleSelected: any = this.cardStyles[0]

  constructor(public modalCtrl: ModalController, private http: HttpClient, private cardsCtrl: CardsService, private utils: UtilsService) { }

  ngOnInit() { }

  search() {
    this.loading = true
    this.http.post('https://recaudo.sondapay.com/recaudowsrest/producto/consultaTrx', { "nivelConsulta": 1, "tipoConsulta": 2, "numExterno": this.cardNumber }).subscribe((data) => {
      this.cardInfo = data
      if(this.cardInfo.estadoCuenta !== 'Activa') {
        this.utils.showAlert(this.cardInfo.mensaje)
      }
      this.loading = false
    }, error => {
      this.loading = false
    })
  }

  save() {
    this.cardsCtrl.saveCard({
      saldo: this.cardInfo.saldo,
      //nombreEstudiante: this.cardInfo.nombreEstudiante,
      numtarjetaExt: this.cardInfo.numtarjetaExt,
      cardStyle: this.cardStyleSelected.image,
      orientation: this.cardStyleSelected.orientation
    })
    this.modalCtrl.dismiss()
  }

}
