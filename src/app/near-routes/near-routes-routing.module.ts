import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NearRoutesPage } from './near-routes.page';

const routes: Routes = [
  {
    path: '',
    component: NearRoutesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NearRoutesPageRoutingModule {}
