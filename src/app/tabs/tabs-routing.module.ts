import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'calculate',
        loadChildren: () => import('../calculate/calculate.module').then(m => m.CalculatePageModule)
      },
      {
        path: 'nearRoutes',
        loadChildren: () => import('../near-routes/near-routes.module').then(m => m.NearRoutesPageModule)
      },
      {
        path: 'routes',
        loadChildren: () => import('../routes/routes.module').then(m => m.RoutesPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'main',
        redirectTo: '/main/calculate',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/calculate',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
