import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitiesPageRoutingModule } from './cities-routing.module';

import { CitiesPage } from './cities.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitiesPageRoutingModule,
    TranslateModule
  ],
  declarations: [CitiesPage]
})
export class CitiesPageModule {}
