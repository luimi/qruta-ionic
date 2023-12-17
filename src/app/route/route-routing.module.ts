import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutePage } from './route.page';

const routes: Routes = [
  {
    path: '',
    component: RoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutePageRoutingModule {}
