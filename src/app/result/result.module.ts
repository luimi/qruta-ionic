import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPageRoutingModule } from './result-routing.module';

import { ResultPage } from './result.page';
import { AdsComponent } from './ads/ads.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultPageRoutingModule,
    TranslateModule
  ],
  declarations: [ResultPage, AdsComponent],
  exports: [AdsComponent]
})
export class ResultPageModule {}
