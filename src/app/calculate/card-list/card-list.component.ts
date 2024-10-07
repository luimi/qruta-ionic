import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CardAddComponent } from '../card-add/card-add.component';
import { CardsService } from 'src/app/utils/cards.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent  implements OnInit {
  cards: any = []
  constructor(public modalCtrl: ModalController, private cardsCtrl: CardsService, private utils: UtilsService, private actionSheet: ActionSheetController) { 
    this.cardsCtrl.updateAll()
  }

  ngOnInit() {
    this.updateCards()
  }
  async addCard() {
    const modal = await this.modalCtrl.create({
      component: CardAddComponent
    });
    await modal.present();
    this.updateCards()
  }
  updateCards() {
    this.cards = this.cardsCtrl.cards
  }
  async openCard(index: number) {
    const answers: any = await this.utils.getTranslation(["general.update", "general.delete", "general.cancel"])
    const actionSheet = await this.actionSheet.create({
      //header: location.address,
      buttons: [{
        text: answers["general.update"],
        icon: 'refresh',
        handler: () => {
          this.cardsCtrl.updateBalance(index)
        }
      }, {
        text: answers["general.delete"],
        icon: 'trash',
        handler: async () => {
          const message: any = await this.utils.getTranslation("calculate.cards.confirm")
          this.utils.showConfirmDialog(message, () => {
            this.cardsCtrl.deleteCard(index)
            this.updateCards()
          })
        }
      }, {
        text: answers["general.cancel"],
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
}
