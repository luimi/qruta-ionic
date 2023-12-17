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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculatePageRoutingModule,
    EmptyStateModule
  ],
  declarations: [CalculatePage, AddressInputComponent, HistoryComponent, AddressMapComponent, AddressModalComponent],
  providers: [Geolocation],
  exports: [HistoryComponent, AddressMapComponent, AddressModalComponent]
})
export class CalculatePageModule {}
