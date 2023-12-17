import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoutesPageRoutingModule } from './routes-routing.module';

import { RoutesPage } from './routes.page';
import { EmptyStateModule } from '../utils/empty-state/empty-state.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoutesPageRoutingModule,
    EmptyStateModule
  ],
  declarations: [RoutesPage]
})
export class RoutesPageModule {}
