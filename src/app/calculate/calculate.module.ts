import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculatePageRoutingModule } from './calculate-routing.module';

import { CalculatePage } from './calculate.page';
import { AddressInputComponent } from './address-input/address-input.component';
import { EmptyStateModule } from '../utils/empty-state/empty-state.module';
import { HistoryComponent } from './history/history.component';
import { AddressMapComponent } from './address-map/address-map.component';
import { AddressModalComponent } from './address-modal/address-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardListComponent } from './card-list/card-list.component';
import { CardAddComponent } from './card-add/card-add.component';
import { CardComponent } from './card/card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculatePageRoutingModule,
    EmptyStateModule,
    TranslateModule
  ],
  declarations: [CalculatePage, AddressInputComponent, HistoryComponent, AddressMapComponent, AddressModalComponent, CardListComponent, CardAddComponent, CardComponent],
  providers: [Geolocation],
  exports: [HistoryComponent, AddressMapComponent, AddressModalComponent, CardListComponent, CardAddComponent, CardComponent]
})
export class CalculatePageModule {}
