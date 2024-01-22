import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultDetailsPageRoutingModule } from './result-details-routing.module';

import { ResultDetailsPage } from './result-details.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultDetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [ResultDetailsPage]
})
export class ResultDetailsPageModule {}
