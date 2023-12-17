import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NearRoutesPageRoutingModule } from './near-routes-routing.module';

import { NearRoutesPage } from './near-routes.page';
import { EmptyStateModule } from '../utils/empty-state/empty-state.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NearRoutesPageRoutingModule,
    EmptyStateModule
  ],
  declarations: [NearRoutesPage]
})
export class NearRoutesPageModule {}
