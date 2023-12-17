import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitiesPageRoutingModule } from './cities-routing.module';

import { CitiesPage } from './cities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitiesPageRoutingModule
  ],
  declarations: [CitiesPage]
})
export class CitiesPageModule {}
