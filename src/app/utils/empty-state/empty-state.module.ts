import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EmptyStateComponent } from './empty-state.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [EmptyStateComponent],
  exports:[EmptyStateComponent],
})
export class EmptyStateModule {}
