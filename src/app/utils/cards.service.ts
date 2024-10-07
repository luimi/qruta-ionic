import { Injectable } from '@angular/core';
import { constants } from './constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  cards: any = []
  constructor(private http: HttpClient) {
    let data = localStorage.getItem(constants.local.cards)
    if(!data) this.cards = []
    else this.cards = JSON.parse(data)
   }

  saveCard(data: any) {
    this.cards.push(data)
    this.updateCards()
  }

  deleteCard(index: number) {
    this.cards.splice(index, 1)
    this.updateCards()
  }

  async updateBalance(index: number) {
    let result: any = await this.getCard(this.cards[index].numtarjetaExt)
    this.cards[index].saldo = result.saldo
    this.updateCards()
  }
  updateAll() {
    for (let i = 0; i < this.cards.length; i++) {
      this.updateBalance(i)
    }
  }
  updateCards(){
    localStorage.setItem(constants.local.cards, JSON.stringify(this.cards))
  }

  getCard(cardNumber: string) {
    return new Promise((res, rej) => {
      this.http.post('https://recaudo.sondapay.com/recaudowsrest/producto/consultaTrx', { "nivelConsulta": 1, "tipoConsulta": 2, "numExterno": cardNumber }).subscribe((data: any) => {
        res(data)
      }, (error: any) => {
        rej(error)
      })
    })
  }
}
