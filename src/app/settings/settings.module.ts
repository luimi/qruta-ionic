import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { FaqComponent } from './faq/faq.component';
import { EmptyStateModule } from '../utils/empty-state/empty-state.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    EmptyStateModule,
    TranslateModule
  ],
  declarations: [SettingsPage, FaqComponent],
  exports:[]
})
export class SettingsPageModule {}
