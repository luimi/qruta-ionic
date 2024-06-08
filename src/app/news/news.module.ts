import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsPageRoutingModule } from './news-routing.module';

import { NewsPage } from './news.page';
import { TwitterComponent } from './twitter/twitter.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateModule } from '../utils/empty-state/empty-state.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsPageRoutingModule,
    TranslateModule,
    EmptyStateModule
  ],
  declarations: [NewsPage, TwitterComponent],
  exports: [TwitterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewsPageModule {}
